const express = require("express")
const router = express.Router()
const usernameController = require("../controllers/usernameController")

router.post("/createUser", usernameController.createUsername)

module.exports = router