const database = require("../databases/databaseMain")

async function missionPassed(req, res){
    const {username} = req.body
    try{
        
        const user = await database.getUser(username)

        if(!user){
            return res.status(404).send("User not found")
        }
        const activeMissionName = user.missionActive
        if(!activeMissionName){
            return res.status(400).send("No active mission found")
        }

        const updateUser = await database.updatedUser(username, activeMissionName)
        let allMissions = await database.getAllMissions()
 

        let passedMissions = updateUser.missionPassed || []
        let failedMissions = updateUser.missionFailed || []

        let availableMissions = allMissions.filter(mission =>{
            return !failedMissions.includes(mission.text)
        })
        availableMissions = availableMissions.filter(mission =>{
            return !passedMissions.includes(mission.text)
        })
      
        if(availableMissions.length === 0){
            return res.status(400).json({ message: "No new missions available" });

        }

        const newMission = availableMissions[Math.floor(Math.random() * availableMissions.length)];

        if(newMission.text.includes("%")){

            const allUsers = await database.getAllUsers()

            const filteredUsers = allUsers.filter(user => user.name !== username)

            if(filteredUsers.length ===0){
            
                console.log("No other users available" )
                return
            }



            const randomUser = filteredUsers[Math.floor(Math.random()* filteredUsers.length)]

            newMission.text = newMission.text.replace("%", randomUser.name)

            console.log("Personalized mission text: "+ newMission.text)
            
        }

        const response = await database.updateMission(username, newMission.text)
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

        const activeMissionText = user.missionActive
        if(!activeMissionText){
            return res.status(400).send("No active mission found")
        }

        const updateUser = await database.userFailedMission(username, activeMissionText)
        console.log(`userid: ${updateUser.name}`)
        let allMissions = await database.getAllMissions()

        let passedMissions = updateUser.missionPassed || []
        let failedMissions = updateUser.missionFailed || []
        let availableMissions = allMissions.filter(mission =>{
            return !failedMissions.includes(mission.text)
        })
        availableMissions = availableMissions.filter(mission =>{
            return !passedMissions.includes(mission.text)
        })

        if(availableMissions.length === 0){
            return res.status(400).json({ message: "No new missions available" });

        }

        const newMission = availableMissions[Math.floor(Math.random() * availableMissions.length)];

        if(newMission.text.includes("%")){

            const allUsers = await database.getAllUsers()

            const filteredUsers = allUsers.filter(user => user.name !== username)

            if(filteredUsers.length ===0){
            
                console.log("No other users available" )
                return
            }



            const randomUser = filteredUsers[Math.floor(Math.random()* filteredUsers.length)]

            newMission.text = newMission.text.replace("%", randomUser.name)

            console.log("Personalized mission text: "+ newMission.text)
            
        }

        const response = await database.updateMission(username, newMission.text)
        res.send(newMission.text)
    }catch(err){
        console.log("Error: "+ err)
        res.status(500).send("Internal Server Error"+ err)
    }
}

async function getMissionTimestamp(req, res) {
    const { username } = req.params
    try {
        const result = database.getMissionTimestamp(req);
        if (result) {
            res.json(result)
        }else {
            res.status(500).json("internal server error")
        }
    }catch (err) {
        throw  err
    }

}

module.exports = {
    missionPassed,
    missionFailed,
    getMissionTimestamp
}