const database = require("../databases/databaseMain")

async function distributeMission(username, personal) {
    const user = await database.getUser(username)
    let mission
    if(personal == true){
        const allMissions = database.getAllMissions()

        mission = allMissions[Math.floor(Math.random() * allMissions.length)];
    }else{
        const nonPersonalMissions = database.getNotPersonalisedMissions()

        mission = nonPersonalMissions[Math.floor(Math.random() * nonPersonalMissions.length)];
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