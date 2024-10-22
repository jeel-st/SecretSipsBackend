const { addGrouptoUser } = require("../controllers/groupController")
const database = require("./databaseMain")
const { ObjectId } = require('mongodb');

async function createGroup(username, groupName){
    console.log("Creating group ", groupName, "...")

    const groupCollection = (await database.initializeCollections()).groups
    const usersCollection = (await database.initializeCollections()).users

    const resultGroup = await groupCollection.insertOne({name: groupName})
    if (resultGroup.insertedCount == 0) {
        console.log("Couldn't add Group")
        return "Could't add group."
    }

    const resultUser = await usersCollection.updateOne({name: username}, { $push: { groupIds: resultGroup.insertedId } })
    console.log("result from user request: ", resultUser)
    if (resultUser.modifiedCount == 0) {
        console.log("Couldn't update user")
        return "Couldn't update user";
    }
    console.log("Group succesfully added with groupId: ", resultGroup.insertedId)
    return resultGroup.insertedId;

}

async function addGroupToUser(username, groupId) {
    console.log("adding group: ", groupId, " to user: ", username)

    //Check if group exists
    const groupCollection = (await database.initializeCollections()).groups
    
    const group = await groupCollection.findOne({_id: new ObjectId(groupId)})
    console.log(group)
    if (group == null) {
        return "group not found"
    }

    // add group to user
    const usersCollection = (await database.initializeCollections()).users
    const user = await usersCollection.updateOne({name: username}, { $push: { groupIds: groupId } })

    if (user.modifiedCount == 0) {
        return "group couldn't be added to user"
    }

    return ("worked")
}

module.exports = {
    createGroup,
    addGroupToUser
}