const sha256File = require("sha256-file");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const appRoot = require("app-root-path");
const url = require("url");
// const axios = require("axios").default;
const unirest = require("unirest");
const FormData = require("form-data");

const Video = require("../models/video");
const User = require("../models/user");
const vidAuthContract = require(appRoot + "/api/util/VidAuth");

exports.getAllVideos = (req, res, next) => {
  Video.findAll()
    .then((videos) => {
      const response = {
        videos: videos,
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

exports.getVideo = (req, res, next) => {
  Video.findByPk(req.params.vidHash)
    .then((video) => {
      const response = {
        video: video,
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.addVideo = (req, res, next) => {
  req.pipe(req.busboy);
  const formData = {};
  let isFake;
  let confidence;

  req.busboy.on("file", (fieldname, file, filename) => {
    console.log("File upload started.");
    let filePath = appRoot + "/public/uploads/" + filename;
    const fstream = fs.createWriteStream(filePath);
    file.pipe(fstream);
    fstream.on("close", () => {
      console.log("File upload finished.");
      sha256File(filePath, (err, sum) => {
        if (err) {
          console.log(err);
          return res.status(409).json(error);
        }

        const newPath =
          appRoot + "/public/uploads/" + sum + "." + filePath.split(".").pop();
        fsp
          .rename(filePath, newPath)
          .then(() => {
            console.log("Renamed file.");

            return vidAuthContract.methods
              .isVidExists(sum)
              .call({ from: formData["userAddress"] });
          })
          .then((result) => {
            if (result) {
              console.log("Video already exists.");
              return Promise.reject({ message: "Video already exists." });
            }

            return unirest
              .post("http://127.0.0.1:8000/api/predict")
              .headers({ "Content-Type": "multipart/form-data" })
              .field("sequence_length", 10)
              .attach("upload_video_file", newPath);
          })
          .then((response) => {
            if (response.body.output === "REAL") {
              isFake = false;
            } else if (response.body.output === "FAKE") {
              isFake = true;
            }
            confidence = response.body.confidence;

            return vidAuthContract.methods
              .addNewVid(sum, response.body.output)
              .send({ from: formData["userAddress"], gas: 3000000 });
          })
          .then(() => {
            return User.findByPk(formData["userAddress"]);
          })
          .then((user) => {
            return user.createVideo({
              vidHash: sum,
              title: formData["title"],
              isFake: isFake,
              confidence: confidence,
              vidPath: decodeURIComponent(url.format(newPath)),
            });
          })
          .then((video) => {
            const response = {
              video: video,
            };
            return res.status(201).json(response);
          })
          .catch((err) => {
            res.status(500).json(err);
            console.error(err);
          });
      });
    });
  });

  req.busboy.on("field", (fieldname, val) => {
    formData[fieldname] = val;
    // console.log(fieldname, formData[fieldname]);
  });
};
