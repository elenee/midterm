const express = require('express')
const connectMongo = require('./config/connectToBD')
const userRouter = require('./routes/user.route')
const authRouter = require('./auth/auth.route')
const expenseRouter = require('./routes/expense.route')
const isAuth = require('./middlewares/isAuth.middleware')
const app = express()
const PORT = 3030

app.use(express.json())
connectMongo()

app.use("/users", isAuth, userRouter)
app.use("/expenses", isAuth, expenseRouter)
app.use("/auth", authRouter)


app.get("/", async (req, res) => {
    res.send("help")
})


app.listen(PORT, () => console.log(`http://localhost:${PORT}`))