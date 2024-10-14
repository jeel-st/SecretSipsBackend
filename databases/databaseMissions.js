const { get } = require("../routes/usernameRouter");
const database = require("./databaseMain")

async function getAllMissions() {
    const allMissions = await database.getDB().collection("missions").find()
            if (allMissions.length === 0) {
                throw new Error("Keine Missionen gefunden.");
            }
    return allMissions
}

async function getNotPersonalisedMissions() {
    const nonPersonalMissions = await database.getDB().collection("missions").find({ personal: "false" })
            if (nonPersonalMissions.length === 0) {
                throw new Error("Keine nicht-personalisierten Missionen gefunden.");
            }
    return nonPersonalMissions
}

module.exports ={
    getAllMissions,
    getNotPersonalisedMissions
}