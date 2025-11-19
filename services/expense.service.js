const { isValidObjectId } = require("mongoose");
const expenseModel = require("../models/expense.model");
const userModel = require("../models/user.model");

const getAllExpenses = async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  limit > 10 ? (limit = 10) : limit;
  const expenses = await expenseModel
    .find()
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("user", "-password");
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

  await userModel.findByIdAndUpdate(req.userId, {
    $push: { expense: newExpense._id },
  });
  res.status(200).json({ message: "expense created", data: newExpense });
};

const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { title, amount, category } = req.body;
  if (!isValidObjectId(id)) {
    return res.status(400).json("invalid id");
  }
  const expense = await expenseModel.findById(id);
  if (!expense) {
    return res.status(400).json("expense not found");
  }
  if (expense.user.toString() !== req.userId) {
    return res.status(403).json("Forbidden");
  }

  const updated = await expenseModel.findByIdAndUpdate(id, {
    title,
    amount,
    category,
  });

  updated.title = title ?? updated.title;
  updated.amount = amount ?? updated.amount;
  updated.category = category ?? updated.category;

  res
    .status(200)
    .json({ message: "expense updated", data: updated, new: true });
};

const deleteExpense = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json("invalid id");
  }
  const expense = await expenseModel.findById(id);
  if (!expense) {
    return res.status(400).json("expense not found");
  }
  if (expense.user.toString() !== req.userId) {
    return res.status(403).json("Forbidden");
  }
  const deleted = await expenseModel.findByIdAndDelete(id);

  res.status(200).json({ message: "expense deleted", data: deleted });
};

module.exports = {
  getExpenseById,
  getAllExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};
