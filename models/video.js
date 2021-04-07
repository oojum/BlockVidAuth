const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Video = sequelize.define("video", {
  vidHash: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  vidPath: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Video;
