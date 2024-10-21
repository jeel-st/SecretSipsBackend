const database = require("./databaseMain")

async function createGroup(username, groupName){
    console.log("Creating group ", groupName, "...")

    const groupCollection = (await database.initializeCollections()).groups

    const resultGroup = await groupCollection.insertOne({name: groupName})
    if (resultGroup.insertedCount == 0) {
        console.log("Couldn't add Group")
        return "Could't add group."
    }

    const resultUser = await groupCollection.updateOne({name: username}, {$set: {groupId: resultGroup.insertedId}})
    if (resultUser.updatedCount == 0) {
        console.log("Couldn't update user")
        return "couldn't find user";
    }
    console.log("Group succesfully added with groupId: ", resultGroup.insertedId)
    return resultGroup.insertedId;

}

module.exports = {
    createGroup
}