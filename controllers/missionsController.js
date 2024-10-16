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
        let allMissions = await database.getAllMissions()
        console.log(`updateUser Points: ${updateUser.points}`)
        console.log(`updateUser Name: ${updateUser.name}`)
        console.log(`updateUser failedMissions: ${updateUser.missionFailed}`)


        let passedMissions = updateUser.missionPassed || []
        let failedMissions = updateUser.missionFailed || []
        console.log(`passedMissions: ${passedMissions}`)
        console.log(`failedMissions: ${failedMissions}`)
        let availableMissions = allMissions.filter(mission =>{
            return !failedMissions.includes(mission.id)
        })
        availableMissions = allMissions.filter(mission =>{
            return !passedMissions.includes(mission.id)
        })
        availableMissions.forEach(mission => {
            console.log("Available Mission: "+ mission.id)
        });
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
        let allMissions = await database.getAllMissions()

        let passedMissions = updateUser.missionPassed || []
        let failedMissions = updateUser.missionFailed || []
        let availableMissions = allMissions.filter(mission =>{
            return !failedMissions.includes(mission.id)
        })
        availableMissions = availableMissions.filter(mission =>{
            return !passedMissions.includes(mission.id)
        })

        if(availableMissions.length === 0){
            return res.status(400).json({ message: "No new missions available" });

        }

        const newMission = availableMissions[Math.floor(Math.random() * availableMissions.length)];
        const response = await database.updateMission(username, newMission.id)
        res.send(newMission.text)
    }catch(err){
        console.log("Error: "+ err)
        res.status(500).send("Internal Server Error"+ err)
    }
}
module.exports = {
    missionPassed,
    missionFailed
}