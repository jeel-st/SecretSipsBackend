const express = require("express")
const router = express.Router()
const logMiddleware = require("./logMiddleware");
const usernameController = require("../controllers/usernameController")

router.use(logMiddleware);

router.post("/createUser", usernameController.createUsername)
router.put("/addPoint", usernameController.addPoint)
router.get("/getPoints", usernameController.getPoints)
router.get("/allUsers", usernameController.getAllUsers)

module.exports = router