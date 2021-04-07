// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VidSource {
    mapping(string => string[]) vidSourceMap;

    function addVidSource(string memory vidHash, string memory vidSourceHash) public {
        require(keccak256(bytes(vidHash)) != keccak256(bytes("")));

        vidSourceMap[vidHash].push(vidSourceHash);
    }

    function getSourcesFromVidHash(string memory vidHash) view public returns(string[] memory) {
        return vidSourceMap[vidHash];
    }
}
