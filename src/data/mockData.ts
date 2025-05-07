export interface Person {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  paidBy: Person;
  splitBetween: Person[];
  addedBy: Person;
  customSplits?: { [key: string]: number };
}

// Initial empty arrays
export const initialPeople: Person[] = [];
export const initialExpenses: Expense[] = []; 