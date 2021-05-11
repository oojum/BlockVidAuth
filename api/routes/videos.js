const express = require("express");

const router = express.Router();
const videoControllers = require("../controllers/videos");

router.get("/", videoControllers.getAllVideos);

router.get("/:vidHash", videoControllers.getVideo);

router.post("/", videoControllers.addVideo);

module.exports = router;
