const {Router} = require('express')
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../services/user.service')
const userRouter = Router()

userRouter.get("/", getAllUsers)
userRouter.get("/:id", getUserById)
userRouter.put("/:id", updateUser)
userRouter.delete("/:id", deleteUser)


module.exports = userRouter