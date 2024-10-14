const database = require("../databases/databaseMain")

async function createUsername(req, res){
    try{
        const result = await database.createUsernamedB(req, res)
        res.send("Success!")
    }catch(err){
        res.status(500).send("Something went wrong.")
    }
}

module.exports = {
    createUsername
}