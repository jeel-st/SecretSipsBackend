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

async function updatedUser(username, activeMissionArray) {
    const updateUser = await database.getDB().collection("users").findOneAndUpdate(
        { name: username },
        {
            $push: { missionPassed: activeMissionArray },
            $set: { missionActive: null } 
        },
        { returnDocument: "after" }
    );
    return updateUser
}

async function userFailedMission(username, newMission) {
    const user = await database.getDB().collection("users").findOneAndUpdate(
        { name: username },
        {
            $push: { missionFailed: newMission },
            $set: { missionActive: null } 
        },
        { returnDocument: "after" }
    );
    return user
}

async function updateMission(username, newMission) {
    console.log("Went into databaseMission")
    const currentDate = new Date()
    const response = await database.getDB().collection("users").updateOne(
        { name: username },
        { $set: { missionActive: newMission, missionTimestamp: currentDate } }
    );
    console.log("update Mission response:")
    console.log(response)
    return "Success"
}

async function getMissionTimestamp(username) {
    const usersCollection = (await database.initializeCollections()).users;

    const user = await usersCollection.findOne({ name: username })
    console.log(user)
    if (user) {
        return user.missionTimestamp
    }else {
        return false;
    }
}

async function getMissionHistory(username) {
    const usersCollection = (await database.initializeCollections()).users;

    const user = await usersCollection.findOne({ name: username })
    console.log(user)
    if (user) {
        return { missionsPassed: user.missionPassed, missionsFailed: user.missionFailed }
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