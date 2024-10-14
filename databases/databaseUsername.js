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
        const result = await database.getDB().collection("users").insertOne({name: username})

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
    
}
module.exports = {
    createUsername
}