const express = require("express")
const router = express.Router()
const usernameController = require("../controllers/usernameController")

router.post("/createUser", usernameController.createUsername)
router.put("/addPoint", usernameController.addPoint)
router.get("/getPoints", usernameController.getPoints)

module.exports = router