const database = require("./databaseMain")

async function createUsername(req, res){

    const {username} = req.body
    console.log("username"+ username)
    if(!username){
        return "Username is required"
    }
    const usernameDatabase = await database.checkUserExists(username)== true
    console.log("usernameDatabase"+ usernameDatabase)
    if(usernameDatabase){
        return "User already exists"
    }
    try{
        const result = await database.getDB().collection("users").insertOne({name: username, points: 0})

        if(result.acknowledged){
            return "Success!"
        }else{
            throw new Error("User creation failed.");
        }
    }catch(err){
        console.error("databaseUsername/createUsername: "+ err)
        throw new Error("User creation failed.")
    }
}

async function addPoint(username) {
    try {
    const usersCollection = (await database.initializeCollections()).users;
    const user = await usersCollection.findOne({ name: username })
    const points = user.points + 1
    console.log(`${username} got now ${points} points.`)
    const update = await usersCollection.updateOne({ name: username }, { $set: { points: points } })

    if (update.updatedCount === 0) {
        return false;
    }else {
        return true;
    }

    } catch (err) {
        throw err;
    }
}

async function getPoints(username) {
    try {
        const usersCollection = (await database.initializeCollections()).users;
        const user = await usersCollection.findOne({ name: username })
        if (user.points !== null) {
            return user.points
        }else {
            return false;
        }
    }catch (err) {
        throw err
    }
}

module.exports = {
    createUsername,
    addPoint
}