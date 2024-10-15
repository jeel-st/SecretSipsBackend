const database = require("../databases/databaseMain")

async function missionPassed(req, res){
    const {username} = req.body
    try{
        
        const user = await database.getDB().collection("users").findOne({name: username})

        if(!user){
            return res.status(404).send("User not found")
        }

        const activeMissionId = user.missionActive
        if(!activeMissionId){
            return res.status(400).send("No active mission found")
        }

        

    }catch(err){

    }
}

module.exports = {
    missionPassed
}