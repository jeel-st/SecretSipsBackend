const database = require("./databaseMain")
const { isValidPassword, isValidEmail, encryptPassword, encryptPasswordWithSalt } = require('../utils/databaseLogic/userLogic')

async function postOneTimeUser(req, res){

    const {username} = req.body
    console.log("username "+ username)
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
        console.log(user)
        if (user != null) {
            console.log(user)
            return user.points
        }else {
            return false;
        }
    }catch (err) {
        throw err
    }
}


async function getAllUsers() {
    try{
            const allUsers = (await database.initializeCollections()).users.find({}).toArray()
            if(allUsers.length === 0){
                throw new Error("No users found")
            }

            return allUsers
            
    }catch(err){
        console.log("Error in databaseUsername/getAllUsers: "+ err)
        throw new Error("No users found")
    }
}

/**
 * Diese Methode dient dazu, einen neuen Benutzer zu registrieren.
 * 
 * @param req: Request-Objekt -> Enthält die Benutzerdaten im Body (username, password, email, firstName, lastName)
 * @return: String -> "Success!" bei erfolgreicher Registrierung, oder ein Fehlerstring bei Problemen
 */

async function postRegisteredUser(req){
    const { username, password, email, firstName, lastName} = req.body
    const friends = []
    const timestamp = Date.now()
    const registerDate = new Date(timestamp).toISOString();
    const profilePicture = null
    const profilePictureCom200 = null
    const profilePictureCom1080 = null
    const sips = 0

    encryptedPasswordAndSalt = await encryptPassword(password)
    encryptedPassword = encryptedPasswordAndSalt[0]
    salt = encryptedPasswordAndSalt[1]
    
    const personalData = { username, profilePicture, profilePictureCom200, profilePictureCom1080, encryptedPassword, salt, email, firstName, lastName, registerDate, friends, sips }
    const usersCollection = (await database.initializeCollections()).users;
    const usernameFinder = await usersCollection.findOne({ username: username})
    const emailFinder = await usersCollection.findOne({ email: email })

    if (isValidPassword(password)) {
        
        if (isValidEmail(email)) {

            if (usernameFinder) {
                return "Duplicate username"
            } else if (emailFinder) {
                
                return "Duplicate Email"
            } else {
                await database.getDB().collection('personalInformation').insertOne(personalData)

                const userIDObj = await database.getSipsterID(username)
                const userID = userIDObj.toString()
                await databaseFriend.acceptFriendRequest(userID,"663bd3b7969fc6302facf1ee")

                return "Success!"
            }
        } else {
            return "Email format false"
        }
    } else {
        return "Password format false"
    }

}

/**
 * Diese Methode dient dazu, einen Benutzer zu löschen.
 * 
 * @param req: Request-Objekt -> Enthält die UserID und das Passwort in den Parametern (userID, password)
 * @return: String -> "Benutzer erfolgreich gelöscht" bei erfolgreicher Löschung, oder ein Fehlerstring bei Problemen
 * @throws Error -> Bei Fehlern während des Löschvorgangs
 */

async function deleteUser(req){
    const userID = new ObjectId(req.params.userID)
    const personalInformation = await database.getDB().collection("personalInformation")
    try {
        const user = await personalInformation.findOne({_id: userID})
        if (user == null) {
            return "Benutzer nicht gefunden"
        } else {
            const result = await personalInformation.deleteOne({ _id: userID })
            if (result.deletedCount === 0) {
                return "user wurde nicht gefunden"
            }
            try {
    
            const deletedFromFriends = await deleteUserFromFriends(userID)
            console.log("deleted friends succesfull " + deletedFromFriends)
            const deletedActivities = await deleteActivitiesFromDeletedUser(userID)
            console.log("deleted activities succesfull " + deletedActivities)
            const deletedReactions = await deleteReactionsFromDeletedUser(userID)
            console.log("deleted reactions succesfull " + deletedReactions)
            const deletedInvitations = await deleteUserFromInvitation(userID)
            console.log("deleted invitations succesfull " + deletedInvitations)
            log.info(`
            User was deleted from ${deletedFromFriends} friend(s).
            ${deletedActivities} Activitie(s) from the user were deleted.
            ${deletedReactions} Reaction(s) from the user were deleted.
            ${deletedInvitations} Invitation(s) deleted.
            `)
            }catch (err) {
                log.error(err)
                return ("Something went wrong with the connected deletions")
            }
            return "Benutzer erfolgreich gelöscht"
        }
    } catch (error) {
        log.error("Fehler beim Löschen des Benutzers:", error)
        return "Interner Serverfehler"
    }
}

/**
 * Diese Methode dient dazu, einen Benutzer aus den Freundeslisten anderer Benutzer zu entfernen.
 * 
 * @param usernameToRemove: String -> Der Benutzername des zu entfernenden Benutzers
 * @return: Integer --> The number of users that got updated
 */

async function deleteUserFromFriends(userIDToRemove) {
    const result = (await database.initializeCollections()).personalInformation.updateMany(
        { friends: userIDToRemove},
        { $pull: { friends: userIDToRemove} }
    );

    return result.modifiedCount
}


module.exports = {
    postOneTimeUser,
    addPoint,
    getPoints,
    getAllUsers,
    postRegisteredUser
}