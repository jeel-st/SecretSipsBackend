const { missionFailed } = require("../controllers/missionsController");
const { get } = require("../routes/usernameRouter");
const database = require("./databaseMain")

async function getAllMissions() {
    const allMissions = await database.getDB().collection("missions").find({}).toArray()
            if (allMissions.length === 0) {
                throw new Error("Keine Missionen gefunden.");
            }
    return allMissions
}

async function getNotPersonalisedMissions() {
    const nonPersonalMissions = await database.getDB().collection("missions").find({personal: "false"}).toArray()
    console.log("nonPersonalMissions"+ nonPersonalMissions)
            if (nonPersonalMissions.length === 0) {
                throw new Error("Keine nicht-personalisierten Missionen gefunden.");
            }
    return nonPersonalMissions
}

async function updatedUser(username, missionText) {
    const updateUser = await database.getDB().collection("users").findOneAndUpdate(
        { name: username },
        {
            $push: { missionPassed: missionText },
            $set: { missionActive: null } 
        },
        { returnDocument: "after" }
    );
    return updateUser
}

async function userFailedMission(username, missionText) {
    const user = await database.getDB().collection("users").findOneAndUpdate(
        { name: username },
        {
            $push: { missionFailed: missionText },
            $set: { missionActive: null } 
        },
        { returnDocument: "after" }
    );
    return user
}

async function updateMission(username, missionText) {
    console.log("Went into databaseMission")
    const currentDate = new Date()
    const response = await database.getDB().collection("users").updateOne(
        { name: username },
        { $set: { missionActive: missionText, activeMissionTimestamp: currentDate } }
    );
    console.log("update Mission response:")
    console.log(response)
    return "Success"
}

async function getMissionTimestamp(username) {
    const usersCollection = (await database.initializeCollections()).usersCollection
    console.log(`usersCollections: ${usersCollection}`)
    const result = await usersCollection.findOne({name: username})
    if (result) {
        return result.missionTimestamp
    }else {
        return false;
    }

}

module.exports ={
    getAllMissions,
    getNotPersonalisedMissions,
    updatedUser,
    userFailedMission,
    updateMission,
    getMissionTimestamp
}