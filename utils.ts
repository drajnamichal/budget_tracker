
import { type Expense } from './types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

export const sortExpenses = (expenses: Expense[]): Expense[] => {
  return expenses.sort((a, b) => {
    // First sort by isFixed status (non-fixed first)
    if (a.isFixed !== b.isFixed) {
      return a.isFixed ? 1 : -1;
    }
    // Then sort by amount (descending)
    return b.amount - a.amount;
  });
};