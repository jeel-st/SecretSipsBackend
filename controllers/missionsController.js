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
        const passedMissions = updateUser.missionPassed || []
        const failedMissions = updateUser.failedMissions || []
        console.log(`passedMissions: ${passedMissions}`)
        console.log(`failedMissions: ${failedMissions}`)
        const availableMissions = allMissions.filter(
            mission => !passedMissions.includes(mission.id) && !failedMissions.includes(mission.id)
        );
        console.log(`availableMissions: ${availableMissions}`)
        if(availableMissions.length === 0){
            return res.status(400).json({ message: "No new missions available" });

        }

        const newMission = availableMissions[Math.floor(Math.random() * availableMissions.length)];
        const response = await database.updateMission(username, newMission.id)
        res.send(newMission.text)
    }catch(err){
        res.status(500).send("Internal Server Error")
    }
}   

async function missionFailed(req, res){
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

        const updateUser = await database.userFailedMission(username, activeMissionId)
        console.log(`userid: ${updateUser.name}`)
        const allMissions = await database.getAllMissions()

        const passedMissions = updateUser.missionPassed || []
        const failedMissions = updateUser.missionFailed || []
        const availableMissions = allMissions.filter(
            mission => !passedMissions.includes(mission.id) && !failedMissions.includes(mission.id)
        );

        if(availableMissions.length === 0){
            return res.status(400).json({ message: "No new missions available" });

        }

        const newMission = availableMissions[Math.floor(Math.random() * availableMissions.length)];
        const response = await database.updateMission(username, newMission.id)
        res.send(newMission.text)
    }catch(err){
        res.status(500).send("Internal Server Error")
    }
}
module.exports = {
    missionPassed,
    missionFailed
}