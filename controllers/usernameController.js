const database = require("../databases/databaseUsername")

async function createUsername(req, res){
    try{
        const result = await database.createUsername(req, res)
        res.send("Success!")
    }catch(err){
        res.status(500).send("Something went wrong.")
    }
}

module.exports = {
    createUsername
}