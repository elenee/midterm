const {Router} = require('express')
const { getAllExpenses, getExpenseById, createExpense, updateExpense, deleteExpense } = require('../services/expense.service')
const expenseRouter = Router()

expenseRouter.get("/", getAllExpenses)
expenseRouter.get("/:id", getExpenseById)
expenseRouter.post("/", createExpense)
expenseRouter.put("/:id", updateExpense)
expenseRouter.delete("/:id", deleteExpense)

module.exports = expenseRouter