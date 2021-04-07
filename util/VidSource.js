const fs = require("fs");
const Web3 = require("web3");
const appRoot = require("app-root-path");

const rpcURL = "HTTP://127.0.0.1:7545";
const web3 = new Web3(rpcURL);

const vidSourceAbi = JSON.parse(
  fs.readFileSync(appRoot + "/build/contracts/VidSource.json", "utf8")
).abi;
const vidSourceAddress = fs
  .readFileSync(appRoot + "/util/VidSourceAddress.txt")
  .toString();
const vidSourceContract = new web3.eth.Contract(vidSourceAbi, vidSourceAddress);

module.exports = vidSourceContract;
