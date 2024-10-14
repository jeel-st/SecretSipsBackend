const database = require("../databases/databaseUsername")

async function createUsername(req, res){
    try{
        const result = await database.createUsername(req, res)
        if(result=="Username is required"){
            res.status(400).send("Username is required")
        }else if(result == "User already exists"){
            res.status(409).send("User already exists")
        }else{
            res.send("Success!")
        }
    }catch(err){
        res.status(500).send("Something went wrong.")
    }
}

module.exports = {
    createUsername
}