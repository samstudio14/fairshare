import { Person, Expense } from '../data/mockData';

interface Balance {
  from: Person;
  to: Person;
  amount: number;
}

export function calculateBalances(expenses: Expense[], people: Person[]): Balance[] {
  const balances: { [key: string]: { [key: string]: number } } = {};

  // Initialize balances for all pairs of people
  people.forEach(person1 => {
    balances[person1.id] = {};
    people.forEach(person2 => {
      if (person1.id !== person2.id) {
        balances[person1.id][person2.id] = 0;
      }
    });
  });

  // Calculate balances from expenses
  expenses.forEach(expense => {
    const paidBy = people.find(p => p.id === expense.paidById);
    if (!paidBy) return;

    const splitBetween = expense.splitBetweenIds
      .map(id => people.find(p => p.id === id))
      .filter((p): p is Person => p !== undefined);

    if (expense.customSplits) {
      // Handle custom splits
      splitBetween.forEach(person => {
        if (person.id !== paidBy.id) {
          const amount = expense.customSplits![person.id];
          balances[person.id][paidBy.id] += amount;
        }
      });
    } else {
      // Handle equal splits
      const splitAmount = expense.amount / splitBetween.length;
      splitBetween.forEach(person => {
        if (person.id !== paidBy.id) {
          balances[person.id][paidBy.id] += splitAmount;
        }
      });
    }
  });

  // Convert balances to array format
  const result: Balance[] = [];
  people.forEach(person1 => {
    people.forEach(person2 => {
      if (person1.id !== person2.id) {
        const amount = balances[person1.id][person2.id] - balances[person2.id][person1.id];
        if (amount > 0) {
          result.push({
            from: person1,
            to: person2,
            amount,
          });
        }
      }
    });
  });

  return result;
}

export function simplifyDebts(balances: Balance[]): Balance[] {
  // Create a copy of balances to work with
  const debts = [...balances];

  // Keep simplifying until no more simplifications are possible
  let simplified: boolean;
  do {
    simplified = false;

    // Try to find a cycle of debts that can be simplified
    for (let i = 0; i < debts.length; i++) {
      for (let j = 0; j < debts.length; j++) {
        if (i !== j && debts[i].to.id === debts[j].from.id) {
          // Found a chain of debts that can be simplified
          const amount = Math.min(debts[i].amount, debts[j].amount);
          
          // Reduce both debts by the minimum amount
          debts[i].amount -= amount;
          debts[j].amount -= amount;

          // If there's remaining amount, create a direct debt
          if (debts[i].amount > 0 && debts[j].amount === 0) {
            debts.push({
              from: debts[i].from,
              to: debts[j].to,
              amount: debts[i].amount,
            });
          }

          // Remove zeroed out debts
          const nonZeroDebts = debts.filter(debt => debt.amount > 0);
          debts.length = 0;
          debts.push(...nonZeroDebts);

          simplified = true;
          break;
        }
      }
      if (simplified) break;
    }
  } while (simplified);

  return debts;
} 