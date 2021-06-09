const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Video = sequelize.define("video", {
  vidHash: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isFake: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  confidence: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vidPath: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Video;
