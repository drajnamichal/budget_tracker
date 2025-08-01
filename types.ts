
import { Timestamp } from 'firebase/firestore';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  isFixed?: boolean;
  createdAt?: Timestamp | null; 
}

export interface ToDoItem {
  id: string;
  text: string;
  createdAt?: Timestamp | null;
}