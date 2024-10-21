const express = require("express")
const router = express.Router()
const logMiddleware = require("./logMiddleware");
const groupController = require("../controllers/groupController")

router.use(logMiddleware);

router.post("/createGroup", groupController.createGroup)

module.exports = router