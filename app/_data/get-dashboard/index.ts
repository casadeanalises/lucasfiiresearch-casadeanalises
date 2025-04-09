import { auth } from "@clerk/nextjs/server";
import connectDB from "@/app/lib/mongodb";
import Transaction, { TransactionType } from "@/app/models/Transaction";

export const getDashboard = async (month: string) => {
  if (!month) {
    throw new Error("Mês não fornecido");
  }

  const { userId } = await auth();

  if (!userId) {
    return {
      totalTransactions: 0,
      totalInvestments: 0,
      totalExpenses: 0,
      totalDeposits: 0,
      percentageByCategory: [],
      recentTransactions: [],
    };
  }

  await connectDB();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const targetMonth = parseInt(month);

  const startDate = new Date(currentYear, targetMonth - 1, 1);
  const endDate = new Date(currentYear, targetMonth, 0);

  const transactions = await Transaction.find({
    userId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).lean();

  const totalTransactions = transactions.length;
  const totalInvestments = transactions
    .filter((t) => t.type === TransactionType.INVESTMENT)
    .reduce((acc, t) => acc + Number(t.amount), 0);
  const totalExpenses = transactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => acc + Number(t.amount), 0);
  const totalDeposits = transactions
    .filter((t) => t.type === TransactionType.DEPOSIT)
    .reduce((acc, t) => acc + Number(t.amount), 0);

  // Calcular percentagem por categoria
  const expensesByCategory = transactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});

  const totalExpenseAmount = Object.values(expensesByCategory).reduce(
    (a, b) => a + b,
    0,
  );

  const percentageByCategory = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      category,
      percentage: totalExpenseAmount ? (amount / totalExpenseAmount) * 100 : 0,
    }),
  );

  // Pegar transações recentes
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return {
    totalTransactions,
    totalInvestments,
    totalExpenses,
    totalDeposits,
    percentageByCategory,
    recentTransactions,
  };
};
