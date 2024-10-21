const database = require("../databases/databaseMain")
const missionLogic = require("../utils/missionLogic")

async function createGroup(req, res) {
    try {
        const { username, groupName } = req.body
        const result = await database.createGroup(username, groupName) 

        if (result == "Couldn't add Group") {
            res.status(504).json("Couldn't add Group")
        }else if("Couldn't update user"){
            res.status(504).json("Couldn't update user")
        }else [
            res.json(result)
        ]
    }catch (err) {
        res.status(500).json("Something went wrong! " + err)
    }
}

module.exports =  {
    createGroup
}