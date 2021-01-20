const VidAuth = artifacts.require("VidAuth");

module.exports = (deployer) => {
  deployer.deploy(VidAuth);
};
