
export interface Expense {
  id: string;
  description: string;
  amount: number;
  isFixed?: boolean;
  createdAt?: any; 
}

export interface ToDoItem {
  id: string;
  text: string;
  createdAt?: any;
}