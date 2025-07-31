
import React from 'react';
import { type Expense } from '../types';
import { formatCurrency } from '../utils';
import { TrashIcon, LockIcon } from './icons';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDeleteExpense }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Zoznam výdavkov</h2>
      <div className="space-y-3 max-h-[400px] lg:max-h-[500px] overflow-y-auto pr-2">
        {expenses.length === 0 ? (
          <p className="text-slate-500 text-center py-8">Zatiaľ žiadne výdavky. Pridajte prvú položku!</p>
        ) : (
          expenses.map((expense) => (
            <div 
              key={expense.id} 
              className={`flex items-center justify-between p-3 rounded-lg ${
                expense.isFixed 
                  ? 'bg-slate-100' 
                  : 'bg-slate-50 hover:bg-slate-100 transition-colors'
              }`}
            >
              <div>
                <p className="font-medium text-slate-800">{expense.description}</p>
                <p className="text-sm text-slate-600">{formatCurrency(expense.amount)}</p>
              </div>
              {expense.isFixed ? (
                <span className="p-2 text-slate-400" title="Táto položka je fixná a nedá sa vymazať.">
                  <LockIcon />
                </span>
              ) : (
                <button
                  onClick={() => onDeleteExpense(expense.id)}
                  className="p-2 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  aria-label="Vymazať položku"
                >
                  <TrashIcon />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseList;