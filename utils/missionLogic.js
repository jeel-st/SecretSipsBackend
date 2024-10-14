const database = require("../databases/databaseMain")

async function distributeMission(username, personal) {
    const user = await database.getUser(username)
    let mission
    if(personal == true){
        const allMissions = await database.getAllMissions()
        console.log("All missions: "+ allMissions)
        mission = allMissions[Math.floor(Math.random() * allMissions.length)];
        console.log("mission selected: "+ mission.text)
    }else{
        const nonPersonalMissions = await database.getNotPersonalisedMissions()
        console.log("All missions: "+ nonPersonalMissions)

        mission = nonPersonalMissions[Math.floor(Math.random() * nonPersonalMissions.length)];
        console.log("mission selected: "+ mission.text)
    }
    await db.collection("users").updateOne(
        { name: username }, // Suche nach dem Benutzernamen
        { $set: { missionActive: mission.id } }
    );
    console.log(`Mission "${mission.text}" (ID: ${mission.id}) wurde dem Benutzer "${username}" zugewiesen.`);
}

module.exports = {
    distributeMission
}