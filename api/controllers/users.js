const { response } = require("express");
const User = require("../models/user");
const Video = require("../models/video");
const { Sequelize } = require("../util/database");

exports.getAllUsers = (req, res, next) => {
  User.findAll({
    include: [
      {
        model: Video,
        attributes: ["vidHash", "title"],
      },
    ],
  }).then((users) => {
    const response = {
      users: users,
    };
    res.status(200).json(response);
  });
};

exports.addUser = (req, res, next) => {
  User.create({
    ethAddress: req.body.user.ethAddress,
    emailId: req.body.user.emailId,
    firstName: req.body.user.firstName,
    lastName: req.body.user.lastName,
  })
    .then((user) => {
      const response = {
        user: user,
      };
      res.status(201).json(response);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json(err);
    });
};

exports.getUser = (req, res, next) => {
  User.findByPk(req.params.ethAddress)
    .then((user) => {
      const response = {
        user: user,
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(new Error("Internal error occurred."));
    });
};

exports.getVideosbyUser = (req, res, next) => {
  User.findByPk(req.params.ethAddress)
    .then((user) => {
      return user.getVideos();
    })
    .then((videos) => {
      const response = {
        videos: videos,
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(new Error("Internal error occurred."));
    });
};
