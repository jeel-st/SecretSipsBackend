const database = require("../databases/databaseMain")

async function createUsername(req, res){
    try{
        const result = await database.createUsername(req, res)
        if(result == ""){
            return 0
        }
        return 0
    }catch(err){
        return 0
    }
}

module.exports = {
    createUsername
}