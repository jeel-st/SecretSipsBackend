const database = require("../databases/databaseMain")

async function distributeMission(username, personal) {
    let mission
    if (personal == true) {
        const allMissions = await database.getAllMissions()
        console.log("All missions: " + allMissions)
        mission = allMissions[Math.floor(Math.random() * allMissions.length)];
        console.log("mission selected: " + mission.text)
        if (mission.text.includes("%")) {
            const allUsers = await database.getAllUsers()
            const filteredUsers = allUsers.filter(user => user.name !== username)
            if(filteredUsers.length ===0){
            
                console.log("No other users available" )
                return
            }
            const randomUser = filteredUsers[Math.floor(Math.random()* filteredUsers.length)]


            console.log("Random user selected: "+ randomUser.name)

            mission.text = mission.text.replace("%", randomUser.name)

            console.log("Personalized mission text: "+ mission.text)
        }
    } else {
        console.log("first")
        const nonPersonalMissions = await database.getNotPersonalisedMissions()
        console.log("All unpersonal missions: " + nonPersonalMissions)

        mission = nonPersonalMissions[Math.floor(Math.random() * nonPersonalMissions.length)];
        console.log("mission selected: " + mission.text)
    }
    const currentDate = new Date();
    await database.getDB().collection("users").updateOne(
        { name: username }, // Suche nach dem Benutzernamen
        { $set: { missionActive: [mission.text, mission.id], missionTimestamp: currentDate } }
    );
    console.log(`Mission "${mission.text}" (ID: ${mission.id}) wurde dem Benutzer "${username}" zugewiesen.`);
}

module.exports = {
    distributeMission
}