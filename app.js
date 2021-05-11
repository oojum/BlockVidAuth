const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const sequelize = require("./api/util/database");
const Video = require("./api/models/video");
const User = require("./api/models/user");
const vidAuthContract = require("./api/util/VidAuth");
const busboy = require("connect-busboy");

const userRouter = require("./api/routes/users");
const videoRouter = require("./api/routes/videos");

const app = express();
// app.set("view engine", "pug");
// app.set("views", "./client/views");
// app.use(fileUpload({ useTempFiles: true, tempFileDir: "./public/temp" }));
app.use(express.static(path.join(__dirname, "client")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(busboy({ highWaterMark: 2 * 1024 * 1024 }));
app.use(morgan("dev"));

app.use("/api/users", userRouter);
app.use("/api/videos", videoRouter);

app.get("/", (req, res, next) => {
  res.sendFile(__dirname + "/client/index.html");
});

// app.use("/", (req, res, next) => {
//   res.redirect("/");
// });

User.hasMany(Video, {
  foreignKey: {
    field: "ownerAddress",
    allowNull: false,
  },
});
Video.belongsToMany(Video, { as: "Source", through: "VideoSource" });

sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.error(err);
  });
