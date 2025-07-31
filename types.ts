export interface Expense {
  id: string;
  description: string;
  amount: number;
  isFixed?: boolean;
}

export interface ToDoItem {
  id: string;
  text: string;
}
