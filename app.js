const express = require("express");
// const fileUpload = require("express-fileupload");
const sha256File = require("sha256-file");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const busboy = require("connect-busboy");

const sequelize = require("./util/database");
const Video = require("./models/video");
const User = require("./models/user");
const vidAuthContract = require("./util/VidAuth");

const app = express();
app.set("view engine", "pug");
app.set("views", "views");
// app.use(fileUpload({ useTempFiles: true, tempFileDir: "./public/temp" }));
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(busboy({ highWaterMark: 2 * 1024 * 1024 }));

app.get("/upload-video", (req, res, next) => {
  res.render("upload");
});

app.post("/upload-video", (req, res, next) => {
  req.pipe(req.busboy);
  const formData = {};

  req.busboy.on("file", (fieldname, file, filename) => {
    console.log("File upload started.");
    let filePath = "./public/uploads/" + filename;
    const fstream = fs.createWriteStream(filePath);
    file.pipe(fstream);
    fstream.on("close", () => {
      console.log("File upload finished.");
      sha256File(filePath, (err, sum) => {
        if (err) {
          console.log(err);
          return res.render(error);
        }

        const newPath =
          "./public/uploads/" + sum + "." + filePath.split(".").pop();
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
              return res.send("already exists");
            }

            return vidAuthContract.methods
              .addNewVid(sum)
              .send({ from: formData["userAddress"], gas: 3000000 })
              .then(() => {
                return Video.create({
                  vidHash: sum,
                  title: formData["title"],
                  vidPath: newPath,
                });
              })
              .then(() => {
                return res.send("entry added.");
              });
          })
          .catch((err) => {
            res.send("error occurred.");
            console.error(err);
          });
      });
    });
  });

  req.busboy.on("field", (fieldname, val) => {
    formData[fieldname] = val;
    // console.log(fieldname, formData[fieldname]);
  });

  // req.busboy.on("finish", () => {
  //   console.log(fileHash);
  //   contract.methods
  //     .addNewVid(fileHash)
  //     .send({ from: formData["userAddress"] });
  // });
});

app.use("/", (req, res, next) => {
  res.redirect("/upload-video");
});

User.hasMany(Video);
Video.belongsToMany(Video, { as: "Source", through: "VideoSource" });

sequelize
  .sync({ force: true })
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.error(err);
  });
