const express = require("express");

const router = express.Router();
const userControllers = require("../controllers/users");

router.get("/", userControllers.getAllUsers);

router.get("/:ethAddress", userControllers.getUser);

router.post("/", userControllers.addUser);

router.get("/:ethAddress/videos", userControllers.getVideosbyUser);

module.exports = router;
