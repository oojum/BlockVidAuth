const fs = require("fs");
const Web3 = require("web3");
const appRoot = require("app-root-path");

const rpcURL = "HTTP://127.0.0.1:7545";
const web3 = new Web3(rpcURL);

const vidAuthAbi = JSON.parse(
  fs.readFileSync(appRoot + "/build/contracts/VidAuth.json", "utf8")
).abi;
const vidAuthAddress = fs
  .readFileSync(appRoot + "/util/VidAuthAddress.txt")
  .toString();
const vidAuthContract = new web3.eth.Contract(vidAuthAbi, vidAuthAddress);

module.exports = vidAuthContract;
