import mongoose from "mongoose";

export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  EXPENSE = "EXPENSE",
  INVESTMENT = "INVESTMENT",
}

export enum TransactionCategory {
  HOUSING = "HOUSING",
  TRANSPORTATION = "TRANSPORTATION",
  FOOD = "FOOD",
  ENTERTAINMENT = "ENTERTAINMENT",
  HEALTH = "HEALTH",
  UTILITY = "UTILITY",
  SALARY = "SALARY",
  EDUCATION = "EDUCATION",
  OTHER = "OTHER",
}

export enum TransactionPaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  BANK_SLIP = "BANK_SLIP",
  CASH = "CASH",
  PIX = "PIX",
  OTHER = "OTHER",
}

const transactionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: Object.values(TransactionType),
    },
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: Object.values(TransactionCategory),
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: Object.values(TransactionPaymentMethod),
    },
    date: { type: Date, required: true },
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);
