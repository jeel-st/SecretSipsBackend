const express = require('express')
const app = express()

app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const PORT = 3000
const { connectToDB } = require("./databases/databaseMain")

connectToDB()


const userRouter = require("./routes/userRouter")
const missionRouter = require("./routes/missionsRouter")
const groupRouter = require("./routes/groupRouter")

app.use("/user", userRouter)
app.use("/missions", missionRouter)
app.use("/groups", groupRouter)
app.use("/static", express.static(__dirname + '/static'))

app.listen(PORT, () => console.log('Server is listening on PORT 3000...'))