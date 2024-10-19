const express = require("express")
const router = express.Router()
const missionController = require("../controllers/missionsController")
const logMiddleware = require("./logMiddleware");


router.use(logMiddleware);

router.put("/missionPassed", missionController.missionPassed)
router.put("/missionFailed", missionController.missionFailed)
router.get("/getMissionTimestamp/:username", missionController.getMissionTimestamp)
router.get("/missionHistory", missionController.getMissionHistory)

module.exports = router