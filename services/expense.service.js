const { isValidObjectId } = require("mongoose");
const expenseModel = require("../models/expense.model");

const getAllExpenses = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
    limit > 10 ? (limit = 10) : limit;
    const expenses = await expenseModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);
  res.status(200).json(expenses);
};

const getExpenseById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json("invalid id");
  }

  const foundExpense = await expenseModel.findById(id);
  if (!foundExpense) {
    return res.status(400).json("expense not found");
  }

  if (foundExpense.user.toString() !== req.userId) {
    return res.status(403).json("Forbidden");
  }

  res.status(200).json({ message: "Found expense", data: foundExpense });
};

const createExpense = async (req, res) => {
  const { title, amount, category } = req.body;
  if (!title || !amount || !category) {
    return res.status(401).json({ message: "all fields are required" });
  }
  const newExpense = await expenseModel.create({
    title,
    amount,
    category,
    user: req.userId,
  });
  res.status(200).json({ message: "expense created", data: newExpense });
};

const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { title, amount, category } = req.body;
  if (!isValidObjectId(id)) {
    return res.status(400).json("invalid id");
  }

  const updated = await expenseModel.findByIdAndUpdate(id, {
    title,
    amount,
    category,
  });
  if (!updated) {
    return res.status(400).json("expense not found");
  }

  if (updated.user.toString() !== req.userId) {
    return res.status(403).json("Forbidden");
  }

  updated.title = title ?? updated.title;
  updated.amount = amount ?? updated.amount;
  updated.category = category ?? updated.category;

  res.status(200).json({ message: "expense updated", data: updated });
};

const deleteExpense = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json("invalid id");
  }

  const deleted = await expenseModel.findByIdAndDelete(id);

  if (!deleted) {
    return res.status(400).json("expense not found");
  }

  if (deleted.user.toString() !== req.userId) {
    return res.status(403).json("Forbidden");
  }

  res.status(200).json({ message: "expense deleted", data: deleted });
};

module.exports = {
  getExpenseById,
  getAllExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};
