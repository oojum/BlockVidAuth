const VidAuth = artifacts.require("VidAuth");
const fs = require("fs");

module.exports = (deployer) => {
  deployer.deploy(VidAuth).then(() => {
    const addr = VidAuth.address;
    // console.log(addr);
    fs.writeFile("./api/util/VidAuthAddress.txt", addr, (err) => {
      if (err) console.error(err);
      else console.log(addr);
    });
  });
};
