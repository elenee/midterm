const { isValidObjectId } = require("mongoose");
const userModel = require("../models/user.model");

const getAllUsers = async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  limit > 10 ? (limit = 10) : limit;
  const users = await userModel
    .find()
    .skip((page - 1) * limit)
    .limit(limit)
    .select("-password");

  res.status(200).json(users);
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json("invalid id");
  }

  const foundUser = await userModel.findById(id).select("-password");
  if (!foundUser) {
    return res.status(400).json("user not found");
  }

  if (req.userId !== id) {
    return res.status(403).json({ message: "can't access other users data" });
  }

  res.status(200).json({ message: "Found user", data: foundUser });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  if (!isValidObjectId(id)) {
    return res.status(400).json("invalid id");
  }

  const updated = await userModel.findByIdAndUpdate(id, {
    username,
    email,
  });

  if (!updated) {
    return res.status(400).json("user not found");
  }

  if(req.userId !== id) {
    return res.status(403).json('forbiiden')
  }

  res.status(200).json({ message: "User updated", data: updated });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json("invalid id");
  }

  const deleted = await userModel.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(400).json("user not found");
  }

  res.status(200).json({ message: "User updated", data: deleted });
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
