const database = require("../databases/databaseMain")
const missionLogic = require("../utils/missionLogic")

async function createGroup(req, res) {
    try {
        const { username, groupName } = req.body
        const result = await database.createGroup(username, groupName) 

        if (result == true) {
            res.json("Croup addded succesfully")
        }else {
            res.status(504).json("Internal servor error")
        }
    }catch (err) {
        res.status(500).json("Something went wrong! " + err)
    }
}

module.exports =  {
    createGroup
}