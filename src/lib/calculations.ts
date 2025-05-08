import { Person, Expense } from '../data/mockData';

interface Balance {
  from: Person;
  to: Person;
  amount: number;
}

export function calculateBalances(expenses: Expense[], people: Person[]): Balance[] {
  // Initialize a map to store the net balance between each pair of people
  const netBalances: { [key: string]: { [key: string]: number } } = {};

  // Initialize net balances for all pairs of people
  people.forEach(person1 => {
    netBalances[person1.id] = {};
    people.forEach(person2 => {
      if (person1.id !== person2.id) {
        netBalances[person1.id][person2.id] = 0;
      }
    });
  });

  // Process each expense
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
          const amountOwed = expense.customSplits![person.id];
          netBalances[person.id][paidBy.id] += amountOwed;
        }
      });
    } else {
      // Handle equal splits
      const sharePerPerson = expense.amount / splitBetween.length;
      splitBetween.forEach(person => {
        if (person.id !== paidBy.id) {
          netBalances[person.id][paidBy.id] += sharePerPerson;
        }
      });
    }
  });

  // Convert net balances to a list of debts
  const debts: Balance[] = [];
  
  // Process each pair of people once
  const processed = new Set<string>();
  
  people.forEach(person1 => {
    people.forEach(person2 => {
      if (person1.id === person2.id) return;
      
      const pairKey = [person1.id, person2.id].sort().join('-');
      if (processed.has(pairKey)) return;
      processed.add(pairKey);

      const amount1 = netBalances[person1.id][person2.id];
      const amount2 = netBalances[person2.id][person1.id];
      const netAmount = amount1 - amount2;

      if (Math.abs(netAmount) > 0.01) { // Use small epsilon to handle floating point errors
        if (netAmount > 0) {
          debts.push({
            from: person1,
            to: person2,
            amount: netAmount
          });
        } else {
          debts.push({
            from: person2,
            to: person1,
            amount: -netAmount
          });
        }
      }
    });
  });

  return debts;
}

export function simplifyDebts(balances: Balance[]): Balance[] {
  // Create a copy of balances to work with
  let debts = [...balances];

  // Keep simplifying until no more simplifications are possible
  let simplified: boolean;
  do {
    simplified = false;

    // Try to find chains of debts that can be simplified
    for (let i = 0; i < debts.length; i++) {
      for (let j = 0; j < debts.length; j++) {
        if (i === j) continue;

        const debt1 = debts[i];
        const debt2 = debts[j];

        // Check if we have a chain: A owes B and B owes C
        if (debt1.to.id === debt2.from.id) {
          const intermediary = debt1.to; // B
          const amount = Math.min(debt1.amount, debt2.amount);

          // Create or update direct debt from A to C
          const directDebtIndex = debts.findIndex(
            d => d.from.id === debt1.from.id && d.to.id === debt2.to.id
          );

          if (directDebtIndex === -1) {
            // Create new direct debt
            debts.push({
              from: debt1.from,
              to: debt2.to,
              amount: amount
            });
          } else {
            // Add to existing direct debt
            debts[directDebtIndex].amount += amount;
          }

          // Reduce the original debts
          debt1.amount -= amount;
          debt2.amount -= amount;

          // Remove zeroed out debts and keep only significant amounts
          debts = debts.filter(debt => debt.amount > 0.01);
          simplified = true;
          break;
        }
      }
      if (simplified) break;
    }
  } while (simplified);

  return debts;
} 