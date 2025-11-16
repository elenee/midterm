const { default: mongoose, Schema } = require("mongoose");

const expenseSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model('expense', expenseSchema)