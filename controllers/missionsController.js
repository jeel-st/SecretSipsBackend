const database = require("../databases/databaseMain")

async function missionPassed(req, res){
    const {username} = req.body
    try{
        
        const user = await database.getUser(username)

        if(!user){
            return res.status(404).send("User not found")
        }

        const activeMissionId = user.missionActive
        if(!activeMissionId){
            return res.status(400).send("No active mission found")
        }

        const updateUser = await database.updatedUser(username, activeMissionId)
        const allMissions = await database.getAllMissions()
        const passedMissions = await updateUser.value.missionPassed || []

        const availableMissions = allMissions.filter(
            mission => !passedMissions.includes(mission.id)
        )
        if(availableMissions.length === 0){
            return res.status(400).json({ message: "No new missions available" });

        }

        const newMission = availableMissions[Math.floor(Math.random() * availableMissions.length)];
        const response = await database.updateMission(username, newMission.id)
        res.send("Success")
    }catch(err){

    }
}

module.exports = {
    missionPassed
}