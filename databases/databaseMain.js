const { MongoClient } = require("mongodb")
let db = null;
const url = `mongodb://localhost:27017/`;
async function connectToDB() {
    await MongoClient.connect(url
    ).then((connection) => {
        db = connection.db('name');
        console.log('connected to database name ...')
    }).catch(err => {
        console.error('Error connecting to MongoDB:', err)
    });
}

Object.assign(exports, {
    connectToDB
})