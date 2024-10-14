const { MongoClient } = require("mongodb")
const { get } = require("../routes/usernameRouter");
const databaseUsername = require("./databaseUsername")

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
    const response = await db.collection("users").findOne({username})
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
    createUserdb
})