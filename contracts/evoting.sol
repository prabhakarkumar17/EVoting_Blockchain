    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    contract Voting {
        struct Candidate {
            string name;
            uint voteCount;
        }

        address public owner;
        Candidate[] public candidates;
        mapping(address => bool) public voters;

        modifier onlyOwner() {
            require(msg.sender == owner, "Not authorized");
            _;
        }

        constructor() {
            owner = msg.sender;
        }

        function addCandidate(string memory name) public onlyOwner {
            candidates.push(Candidate(name, 0));
        }

        function vote(uint candidateIndex) public {
            require(!voters[msg.sender], "Already voted");
            require(candidateIndex < candidates.length, "Invalid candidate");
            voters[msg.sender] = true;
            candidates[candidateIndex].voteCount++;
        }

        function getCandidates() public view returns (Candidate[] memory) {
            return candidates;
        }

        function getCandidateCount() public view returns (uint) {
            return candidates.length;
        }

        function getCandidate(uint index) public view returns (string memory name, uint voteCount) {
            require(index < candidates.length, "Invalid candidate");
            return (candidates[index].name, candidates[index].voteCount);
        }
    }
