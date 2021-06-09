// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VidAuth {
    struct VidData {
        address vidOwner;
        string vidPrediction;
        bool exists;
    }

    mapping(string => VidData) vidDataMap;
    mapping(address => string[]) vidsMap;

    function addNewVid(string memory vidHash, string memory vidPrediction) public {
        require(keccak256(bytes(vidHash)) != keccak256(bytes("")));

        vidDataMap[vidHash].vidOwner = msg.sender;
        vidDataMap[vidHash].exists = true;
        vidDataMap[vidHash].vidPrediction = vidPrediction;
        vidsMap[msg.sender].push(vidHash);
    }

    function isVidExists(string memory vidHash) view public returns(bool) {
        return vidDataMap[vidHash].exists;
    }

    function getOwnerFromHash(string memory vidHash) view public returns(address) {
        return vidDataMap[vidHash].vidOwner;
    }

    function getVidsFromOwner(address owner) view public returns(string[] memory) {
        return vidsMap[owner];
    }
}
