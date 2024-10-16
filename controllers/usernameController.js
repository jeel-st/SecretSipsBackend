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
            let mission
            try{
                const user = await database.getUser(username)
                console.log("User "+ user)
                console.log("User MissionID: "+ user.missionActive)
                const missionId = user.missionActive
                console.log("MissionID"+ missionId)
                mission = await database.getMissionById(missionId)
            }catch(err){
                throw new Error("User wasn't found."+ err)
            }
            missionText = mission.text
            res.send(missionText)

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

module.exports = {
    createUsername,
    addPoint,
    getPoints
}