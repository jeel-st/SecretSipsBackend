const { MongoClient } = require("mongodb")
const { get } = require("../routes/userRouter");
const databaseUsername = require("./databaseUser");
const databaseMissions = require("./databaseMissions");
const databaseGroup = require("./databaseGroup");
const { text } = require("express");

let db = null;
const url = `mongodb://localhost:27017/`;
async function connectToDB() {
    await MongoClient.connect(url
    ).then((connection) => {
        db = connection.db('secretSips');
        console.log('connected to database secretSips ...')
    }).catch(err => {
        console.error('Error connecting to MongoDB:', err)
    });
}

async function createUserdb(req, res) {
    return await databaseUsername.postOneTimeUser(req, res)
}

async function registerUser(req) {
    return await databaseUsername.postRegisteredUser(req)
}

async function checkUserExists(username){
    const response = await db.collection("users").findOne({name: username})
    return response !== null; // Gibt true zurück, wenn der Benutzer existiert
}

async function getAllMissions() {
    return await databaseMissions.getAllMissions()
}

async function getNotPersonalisedMissions() {
    return await databaseMissions.getNotPersonalisedMissions()
}

async function addPoint(username) {
    return await databaseUsername.addPoint(username);
}

async function getPoints(username) {
    return await databaseUsername.getPoints(username);
}

async function updatedUser(username, missionId) {
    return await databaseMissions.updatedUser(username, missionId)
}

async function userFailedMission(username, missionId) {
    return await databaseMissions.userFailedMission(username, missionId)
}

async function updateMission(username, missionId) {
    console.log("Went into databaseMain")
    return await databaseMissions.updateMission(username, missionId)
}

async function getAllUsersForScoreboard() {
    const users = await getAllUsers()
    const scoreBoard = []
    if (users !== null) {
        users.forEach(user => {
            if (user.missionPassed) {
                let count = 0;
                user.missionPassed.forEach(mission => {
                    count++;
                })
                scoreBoard.push({
                    name: user.name,
                    count: count
                })
            }else {
                scoreBoard.push({
                    name: user.name,
                    count: 0
                })
            }
            
        });
    }
    scoreBoard.sort((a, b) => b.count - a.count); 

    return scoreBoard;
    
}

async function getAllUsers() {
    return await databaseUsername.getAllUsers()
}

async function getMissionTimestamp(username) {
    return await databaseMissions.getMissionTimestamp(username)
}

async function getMissionHistory(username) {
    return await databaseMissions.getMissionHistory(username)
}

async function addGroupToUser(username, groupId) {
    return await databaseGroup.addGroupToUser(username, groupId)
}

async function checkUserCount() {
    try {
        console.log("Went into checkusercount")
        const count = await db.collection("users").countDocuments();

        console.log(`Anzahl der Benutzer in der Collection: ${count}`);

        return count;
    } catch (err) {
        console.error("Fehler beim Zählen der Benutzer:", err);
        throw new Error("Fehler beim Abrufen der Benutzeranzahl.");
    }
}

async function getUser(username) {
    const user = await db.collection("users").findOne({ name: username });
        if (!user) {
            throw new Error(`Benutzer mit dem Namen ${username} nicht gefunden.`);
        }
    return user
}

async function getMissionById(missionText) {
    const mission = await db.collection("missions").findOne({text: missionText})
    if(!mission){
        throw new Error("Mission nicht gefunden")
        
    }
    return mission
}

async function initializeCollections() {
    const missions = db.collection("missions");
    const users = db.collection("users");
    const groups = db.collection("groups");
    const oneTimeUsers = db.collection("oneTimeUsers");

    return {
        missions: missions,
        users: users,
        groups: groups,
        oneTimeUsers: oneTimeUsers
    };
}

async function createGroup(username, groupName) {
    return await databaseGroup.createGroup(username, groupName)
}

function getDB(){
    if (!db) {
        throw new Error("Database not initialized. Call connectToDB first.");
    }
    return  db
}


Object.assign(exports, {
    connectToDB,
    getDB,
    createUserdb,
    checkUserExists,
    checkUserCount,
    getUser,
    getAllMissions,
    getNotPersonalisedMissions,
    addPoint,
    getPoints,
    initializeCollections,
    updatedUser,
    updateMission,
    userFailedMission,
    getMissionById,
    getAllUsers,
    getMissionTimestamp,
    getMissionHistory,
    getAllUsersForScoreboard,
    createGroup,
    addGroupToUser,
    registerUser,
    registerUser
})