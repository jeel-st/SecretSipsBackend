const { MongoClient } = require("mongodb")
const { get } = require("../routes/usernameRouter");


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


function getDB(){
    return  db
}


module.exports =  {
    connectToDB,
    createUsernamedB,
    getDB
}