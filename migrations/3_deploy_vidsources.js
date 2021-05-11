const VidSource = artifacts.require("VidSource");
const fs = require("fs");

module.exports = (deployer) => {
  deployer.deploy(VidSource).then(() => {
    const addr = VidSource.address;
    // console.log(addr);
    fs.writeFile("./api/util/VidSourceAddress.txt", addr, (err) => {
      if (err) console.error(err);
      else console.log(addr);
    });
  });
};
