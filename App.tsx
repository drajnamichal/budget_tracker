import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { collection, query, orderBy, onSnapshot, writeBatch, doc, addDoc, getDocs, where, deleteDoc, updateDoc } from 'firebase/firestore';
import { type Expense, type ToDoItem } from './types';
import { TOTAL_BUDGET } from './constants';
import { sortExpenses } from './utils';
import Summary from './components/Summary';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ToDoList from './components/ToDoList';
import { db, serverTimestamp } from './firebase';


const initialExpensesData: Omit<Expense, 'id' | 'createdAt'>[] = [
  { description: 'Posteľ', amount: 785.00, isFixed: false },
  { description: 'Batéria', amount: 42.90, isFixed: false },
  { description: 'Chladnička', amount: 701.28, isFixed: false },
  { description: 'Umývačka', amount: 626.65, isFixed: false },
  { description: 'Rúra', amount: 416.07, isFixed: false },
  { description: 'Varná doska', amount: 264.00, isFixed: false },
  { description: 'Spálňová zostava', amount: 1880.00, isFixed: false },
  { description: 'Skriňa chodba', amount: 1680.00, isFixed: false },
  { description: 'Kuchynská linka s digestorom a drezom', amount: 6440.00, isFixed: false },
  { description: 'Kolky', amount: 200.00, isFixed: false },
  { description: 'Elektromer', amount: 171.95, isFixed: false },
  { description: 'Byt - Hypotéka', amount: 150000.00, isFixed: true },
  { description: 'Byt - Vlastné zdroje', amount: 77973.00, isFixed: true },
];

const initialToDoData: Omit<ToDoItem, 'id'>[] = [
  { text: 'Sušička' },
  { text: 'Matrace' },
  { text: 'Gauč' },
  { text: 'Jed. stôl' },
  { text: 'Stoličky' },
  { text: 'Zrkadlo' },
  { text: 'Komoda' },
  { text: 'Svietidlá' },
  { text: 'Taburetka' },
];

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [toDoItems, setToDoItems] = useState<ToDoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const expensesColRef = collection(db, 'expenses');
    const q = query(expensesColRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      if (querySnapshot.empty && initialExpensesData.length > 0) {
        console.log("Empty expenses collection, seeding data...");
        const batch = writeBatch(db);
        initialExpensesData.forEach(expense => {
          const docRef = doc(collection(db, 'expenses'));
          batch.set(docRef, { ...expense, createdAt: serverTimestamp() });
        });
        await batch.commit();
      } else {
         const expensesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Expense));
        setExpenses(sortExpenses(expensesData));
      }
      setLoading(false);
    }, (error) => {
        console.error("Error fetching expenses: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const todoColRef = collection(db, 'todo_items');
    const q = query(todoColRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
         if (querySnapshot.empty && initialToDoData.length > 0) {
            console.log("Empty todo collection, seeding data...");
            const batch = writeBatch(db);
            initialToDoData.forEach(todo => {
                const docRef = doc(collection(db, 'todo_items'));
                batch.set(docRef, {...todo, createdAt: serverTimestamp() });
            });
            await batch.commit();
        } else {
            const todoData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            } as ToDoItem));
            setToDoItems(todoData);
        }
    }, (error) => {
        console.error("Error fetching To-Do items: ", error);
    });

    return () => unsubscribe();
  }, []);

  const addExpense = useCallback(async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'expenses'), { ...expense, createdAt: serverTimestamp() });

      // Automatically remove from to-do list by description
      const todoColRef = collection(db, "todo_items");
      const todoQuery = query(todoColRef, where("text", "==", expense.description));
      const querySnapshot = await getDocs(todoQuery);
      if (!querySnapshot.empty) {
        const batch = writeBatch(db);
        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
      }

    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'expenses', id));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  }, []);

  const updateExpense = useCallback(async (id: string, newValues: Partial<Omit<Expense, 'id' | 'createdAt'>>) => {
    try {
      const expenseDocRef = doc(db, 'expenses', id);
      await updateDoc(expenseDocRef, newValues);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  }, []);

  const addToDoItem = useCallback(async (text: string) => {
    if (text.trim()) {
      try {
        await addDoc(collection(db, 'todo_items'), { text: text.trim(), createdAt: serverTimestamp() });
      } catch (e) {
        console.error("Error adding To-Do item: ", e);
      }
    }
  }, []);

  const deleteToDoItem = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'todo_items', id));
    } catch (e) {
      console.error("Error deleting To-Do item: ", e);
    }
  }, []);

  const { totalSpent, remainingBudget } = useMemo(() => {
    const spent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    return {
      totalSpent: spent,
      remainingBudget: TOTAL_BUDGET - spent,
    };
  }, [expenses]);

  if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center text-slate-600">
            <p>Pripájam sa k databáze...</p>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">Sledovanie rozpočtu bytu</h1>
          <p className="text-slate-600 mt-2">Majte prehľad o svojich investíciách do nového bývania.</p>
        </header>

        <main className="space-y-8">
          <Summary 
            totalBudget={TOTAL_BUDGET}
            totalSpent={totalSpent}
            remainingBudget={remainingBudget}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <ExpenseForm onAddExpense={addExpense} />
            </div>
            <div className="lg:col-span-3">
              <ExpenseList 
                expenses={expenses} 
                onDeleteExpense={deleteExpense} 
                onUpdateExpense={updateExpense}
                totalBudget={TOTAL_BUDGET}
                totalSpent={totalSpent}
                remainingBudget={remainingBudget}
              />
            </div>
            <div className="lg:col-span-5">
              <ToDoList 
                items={toDoItems}
                onAddItem={addToDoItem}
                onDeleteItem={deleteToDoItem}
              />
            </div>
          </div>
        </main>

        <footer className="text-center mt-12 text-sm text-slate-500">
          <p>Vytvorené s láskou pre spoločné ciele ❤️</p>
        </footer>
      </div>
    </div>
  );
};

export default App;