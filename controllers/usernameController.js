const database = require("../databases/databaseMain")
const missionLogic = require("../utils/missionLogic")

async function createUsername(req, res) {
    const { username } = req.body
    console.log("Username: "+ username)
    try {
        const result = await database.createUserdb(req, res)
        if (result == "Username is required") {
            res.status(400).send("Username is required")
        } else if (result == "User already exists") {
            res.status(409).send("User already exists")
        } else {
            const countUsers = await database.checkUserCount()
            console.log("countUsers "+ countUsers)
            try {
                if (countUsers > 5) {
                    await missionLogic.distributeMission(username, true)
                } else {
                    await missionLogic.distributeMission(username, false)
                }
            }catch(err){
                console.log(err)
                throw new Error("Mission distribution went wrong")
            }
            res.send("Success!")
        }
    } catch (err) {
        res.status(500).send("Something went wrong.")
    }
}

module.exports = {
    createUsername
}