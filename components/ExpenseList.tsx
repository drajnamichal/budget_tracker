
import React, { useState } from 'react';
import { type Expense } from '../types';
import { formatCurrency } from '../utils';
import { TrashIcon, LockIcon, EditIcon, CheckIcon, XIcon } from './icons';
import { CategoryEmoji, MoneyEmoji } from './icons';
import ExportButton from './ExportButton';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onUpdateExpense: (id: string, newValues: { description: string, amount: number }) => void;
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ 
  expenses, 
  onDeleteExpense, 
  onUpdateExpense, 
  totalBudget, 
  totalSpent, 
  remainingBudget 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [editedAmount, setEditedAmount] = useState('');

  const handleEditStart = (expense: Expense) => {
    setEditingId(expense.id);
    setEditedDescription(expense.description);
    setEditedAmount(expense.amount.toString());
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedDescription('');
    setEditedAmount('');
  };

  const handleSaveEdit = (id: string) => {
    const numericAmount = parseFloat(editedAmount);
    if (editedDescription.trim() && !isNaN(numericAmount) && numericAmount > 0) {
      onUpdateExpense(id, { description: editedDescription.trim(), amount: numericAmount });
      handleCancelEdit();
    } else {
      // Basic error handling or feedback can be added here
      console.error("Invalid description or amount.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <CategoryEmoji className="text-xl" />
        Zoznam výdavkov
      </h2>
      <div className="space-y-3 max-h-[400px] lg:max-h-[500px] overflow-y-auto pr-2">
        {expenses.length === 0 ? (
          <p className="text-slate-500 text-center py-8">Zatiaľ žiadne výdavky. Pridajte prvú položku!</p>
        ) : (
          expenses.map((expense) => (
            <div 
              key={expense.id} 
              className={`flex items-center justify-between p-3 rounded-lg ${
                expense.isFixed ? 'bg-slate-100' : 'bg-slate-50'
              }`}
            >
              {editingId === expense.id ? (
                <>
                  <div className="flex-grow space-y-2">
                    <input
                      type="text"
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="block w-full px-2 py-1 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      aria-label="Upraviť popis"
                    />
                    <input
                      type="number"
                      value={editedAmount}
                      onChange={(e) => setEditedAmount(e.target.value)}
                      className="block w-full px-2 py-1 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      aria-label="Upraviť sumu"
                    />
                  </div>
                  <div className="flex items-center ml-2">
                    <button onClick={() => handleSaveEdit(expense.id)} className="p-2 rounded-full text-emerald-600 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500" aria-label="Uložiť zmeny">
                      <CheckIcon />
                    </button>
                    <button onClick={handleCancelEdit} className="p-2 rounded-full text-slate-500 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500" aria-label="Zrušiť úpravy">
                      <XIcon />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="font-medium text-slate-800">{expense.description}</p>
                    <p className="text-sm text-slate-600 flex items-center gap-1">
                      <MoneyEmoji className="text-xs" />
                      {formatCurrency(expense.amount)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {expense.isFixed ? (
                      <span className="p-2 text-slate-400" title="Táto položka je fixná a nedá sa vymazať.">
                        <LockIcon />
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditStart(expense)}
                          className="p-2 rounded-full text-slate-500 hover:bg-blue-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          aria-label="Upraviť položku"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => onDeleteExpense(expense.id)}
                          className="p-2 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          aria-label="Vymazať položku"
                        >
                          <TrashIcon />
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Export Button */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex justify-center">
          <ExportButton 
            expenses={expenses}
            totalBudget={totalBudget}
            totalSpent={totalSpent}
            remainingBudget={remainingBudget}
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;