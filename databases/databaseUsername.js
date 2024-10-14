const database = require("./databaseMain")

async function createUsername(req, res){

    const {username} = req.body
    console.log("username"+ username)
    if(!username){
        return res.status(400).send("Username is required")
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
module.exports = {
    createUsername
}