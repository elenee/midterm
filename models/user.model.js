const { default: mongoose, Schema } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },

    expense: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'expense',
      default: [],
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model('user', userSchema)