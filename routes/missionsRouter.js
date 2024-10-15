const express = require("express")
const router = express.Router()
const missionController = require("../controllers/missionsController")

router.put("/missionPassed", missionController.missionPassed)

module.exports = router