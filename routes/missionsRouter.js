const express = require("express")
const router = express.Router()
const missionController = require("../controllers/missionsController")

router.put("/missionPassed", missionController.missionPassed)
router.put("/missionFailed", missionController.missionFailed)

module.exports = router