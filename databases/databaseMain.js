const { MongoClient } = require("mongodb")
const { get } = require("../routes/usernameRouter");
const databaseUsername = require("./databaseUsername")
const databaseMissions = require("./databaseMissions")

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
    await databaseUsername.createUsername(req, res)
}

async function checkUserExists(username){
    const response = await db.collection("users").findOne({name: username})
    return response !== null; // Gibt true zurück, wenn der Benutzer existiert
}

async function getAllMissions() {
    await databaseMissions.getAllMissions()
}

async function getNotPersonalisedMissions() {
    await databaseMissions.getNotPersonalisedMissions()
}

async function checkUserCount() {
    try {
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
    getNotPersonalisedMissions
})