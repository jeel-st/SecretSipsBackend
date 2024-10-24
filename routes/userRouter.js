const express = require("express")
const router = express.Router()
const logMiddleware = require("./logMiddleware");
const usernameController = require("../controllers/userController")

router.use(logMiddleware);

router.post("/createUser", usernameController.createUsername)
router.post("/registerUser", usernameController.postRegister)
router.put("/addPoint", usernameController.addPoint)
router.get("/getPoints", usernameController.getPoints)
router.get("/allUsers", usernameController.getAllUsers)

module.exports = router