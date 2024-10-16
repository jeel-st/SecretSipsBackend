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

async function updatedUser(username, missionId) {
    const updateUser = await database.getDB().collection("users").findOneAndUpdate(
        { name: username },
        {
            $push: { missionPassed: missionId },
            $set: { missionActive: null } 
        },
        { returnDocument: "after" }
    );
    return updateUser
}

async function userFailedMission(username, missionId) {
    const user = await database.getDB().collection("users").findOneAndUpdate(
        { name: username },
        {
            $push: { missionFailed: missionId },
            $set: { missionActive: null } 
        },
        { returnDocument: "after" }
    );
    return user
}

async function updateMission(username, missionId) {
    console.log("Went into databaseMission")
    const response = await database.getDB().collection("users").updateOne(
        { name: username },
        { $set: { missionActive: missionId } }
    );
    console.log("update Mission response:")
    console.log(response)
    return "Success"
}

module.exports ={
    getAllMissions,
    getNotPersonalisedMissions,
    updatedUser,
    userFailedMission,
    updateMission
}