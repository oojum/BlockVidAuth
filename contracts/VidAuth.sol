// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VidAuth {
    struct OwnerData {
        address vidOwner;
        bool exists;
    }

    mapping(string => OwnerData) ownerMap;
    mapping(address => string[]) vidsMap;

    function addNewVid(string memory vidHash) public {
        require(keccak256(bytes(vidHash)) != keccak256(bytes("")));

        ownerMap[vidHash].vidOwner = msg.sender;
        ownerMap[vidHash].exists = true;
        vidsMap[msg.sender].push(vidHash);
    }

    function isVidExists(string memory vidHash) view public returns(bool) {
        return ownerMap[vidHash].exists;
    }

    function getOwnerFromHash(string memory vidHash) view public returns(address) {
        return ownerMap[vidHash].vidOwner;
    }

    function getVidsFromOwner(address owner) view public returns(string[] memory) {
        return vidsMap[owner];
    }
}
