import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { type Expense, type ToDoItem } from './types';
import { TOTAL_BUDGET, LOCAL_STORAGE_KEY, TODO_STORAGE_KEY } from './constants';
import Summary from './components/Summary';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ToDoList from './components/ToDoList';

const initialExpensesData: Expense[] = [
  { id: 'init-11', description: 'Posteľ', amount: 785.00 },
  { id: 'init-10', description: 'Batéria', amount: 42.90 },
  { id: 'init-9', description: 'Chladnička', amount: 701.28 },
  { id: 'init-8', description: 'Umývačka', amount: 626.65 },
  { id: 'init-7', description: 'Rúra', amount: 416.07 },
  { id: 'init-6', description: 'Varná doska', amount: 264.00 },
  { id: 'init-5', description: 'Spálňová zostava', amount: 1880.00 },
  { id: 'init-4', description: 'Skriňa chodba', amount: 1680.00 },
  { id: 'init-3', description: 'Kuchynská linka s digestorom a drezom', amount: 6440.00 },
  { id: 'init-2', description: 'Kolky', amount: 200.00 },
  { id: 'init-1', description: 'Elektromer', amount: 171.95 },
  // Foundational costs, added to the end so they appear at the bottom of the list (oldest)
  { id: 'init-fixed-2', description: 'Byt - Hypotéka', amount: 150000.00, isFixed: true },
  { id: 'init-fixed-1', description: 'Byt - Vlastné zdroje', amount: 77973.00, isFixed: true },
];

const initialToDoData: ToDoItem[] = [
  { id: 'todo-1', text: 'Sušička' },
  { id: 'todo-2', text: 'Matrace' },
  { id: 'todo-3', text: 'Gauč' },
  { id: 'todo-4', text: 'Jed. stôl' },
  { id: 'todo-5', text: 'Stoličky' },
  { id: 'todo-6', text: 'Zrkadlo' },
  { id: 'todo-7', text: 'Komoda' },
  { id: 'todo-8', text: 'Svietidlá' },
  { id: 'todo-9', text: 'Taburetka' },
];


const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const savedExpenses = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedExpenses === null) {
        return initialExpensesData.sort((a, b) => (a.isFixed === b.isFixed) ? 0 : a.isFixed ? 1 : -1);
      }
      return JSON.parse(savedExpenses);
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return [];
    }
  });

  const [toDoItems, setToDoItems] = useState<ToDoItem[]>(() => {
    try {
      const savedToDos = window.localStorage.getItem(TODO_STORAGE_KEY);
      if (savedToDos === null) {
        return initialToDoData;
      }
      return JSON.parse(savedToDos);
    } catch (error) {
      console.error("Error reading todos from localStorage", error);
      return initialToDoData;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error("Error saving to localStorage", error);
    }
  }, [expenses]);
  
  useEffect(() => {
    try {
      window.localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(toDoItems));
    } catch (error) {
      console.error("Error saving todos to localStorage", error);
    }
  }, [toDoItems]);

  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = { ...expense, id: Date.now().toString(), isFixed: false };
    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);

    // Automatically remove from to-do list if the description matches
    setToDoItems(prevToDoItems =>
      prevToDoItems.filter(item => 
        item.text.trim().toLowerCase() !== newExpense.description.trim().toLowerCase()
      )
    );
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id && !expense.isFixed));
  }, []);

  const addToDoItem = useCallback((text: string) => {
    if (text.trim()) {
      const newItem: ToDoItem = { id: Date.now().toString(), text: text.trim() };
      setToDoItems(prevItems => [newItem, ...prevItems]);
    }
  }, []);

  const deleteToDoItem = useCallback((id: string) => {
    setToDoItems(prevItems => prevItems.filter(item => item.id !== id));
  }, []);

  const { totalSpent, remainingBudget } = useMemo(() => {
    const spent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    return {
      totalSpent: spent,
      remainingBudget: TOTAL_BUDGET - spent,
    };
  }, [expenses]);

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
              <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
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
          <p>Vytvorené s láskou pre spoločné ciele.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;