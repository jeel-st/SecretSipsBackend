const database = require("../databases/databaseMain")
const missionLogic = require("../utils/missionLogic")

async function createUsername(req, res) {
    const { username } = req.body
    console.log("Username: "+ username)
    try {
        let mission
        const result = await database.createUserdb(req, res)
        if (result == "Username is required") {
            res.status(400).send("Username is required")
        } else if (result == "User already exists") {
            const user = await database.getUser(username)
            const missionName = user.missionActive
            res.status(209).send(missionName)
        } else {
            console.log("Result from usertest: "+ result)
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
            
            try{
                const user = await database.getUser(username)
                mission = user.missionActive[0]
            }catch(err){
                throw new Error("User wasn't found."+ err)
            }
            res.send(mission)

        }
    } catch (err) {
        res.status(500).send("Something went wrong. "+ err)
    }
}

async function addPoint(req, res) {
    try {
        const { username } = req.body
        const result = await database.addPoint(username) 

        if (result == true) {
            res.json("Point addded succesfully")
        }else {
            res.status(500).json("Internal servor error")
        }
    }catch (err) {
        res.status(500).json("Something went wrong! " + err)
    }
}

async function getPoints(req, res) {
    try {
        const { username } = req.body
        const result = await database.getPoints(username)

        if (result != false) {
            res.json(result)
        }else {
            res.status(504).json("No Points found for that user! Or the user doesn't exist!")
        }
    }catch (err) {
        res.status(500).json("Something went wrong here: " + err)
    }
}

async function getAllUsers(req, res) {
    try {
        const result = await database.getAllUsersForScoreboard()

        if (result != false) {
            res.json(result)
        }else {
            res.status(504).json("No Users found for that user! Or the user doesn't exist!")
        }
    }catch (err) {
        res.status(500).json("Something went wrong here: " + err)
    }
}

module.exports = {
    createUsername,
    addPoint,
    getPoints,
    getAllUsers
}