const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("major_project", "root", "Enigma50", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
