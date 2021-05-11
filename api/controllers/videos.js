const sha256File = require("sha256-file");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const appRoot = require("app-root-path");

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
      res.status(200).json(video);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.addVideo = (req, res, next) => {
  req.pipe(req.busboy);
  const formData = {};

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
            // console.log(result);
            if (result) {
              return res.status(400).json({ message: "Video already exists." });
            }

            return vidAuthContract.methods
              .addNewVid(sum)
              .send({ from: formData["userAddress"], gas: 3000000 })
              .then(() => {
                return User.findByPk(formData["userAddress"]);
                // return Video.create({
                //   vidHash: sum,
                //   title: formData["title"],
                //   vidPath: newPath,
                //   ownerAddress: formData["userAddress"],
                // });
              })
              .then((user) => {
                return user.createVideo({
                  vidHash: sum,
                  title: formData["title"],
                  vidPath: newPath,
                });
              })
              .then((video) => {
                const response = {
                  video: video,
                };
                return res.status(201).json(response);
              });
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
