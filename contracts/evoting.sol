// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    address public electionOfficial;
    bool public electionEnded = false;
    uint public candidatesCount;

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public voters;

    event Voted(address voter, uint candidateId);
    event ElectionEnded();

    modifier onlyOfficial() {
        require(msg.sender == electionOfficial, "Only election official can perform this action");
        _;
    }

    modifier electionOngoing() {
        require(!electionEnded, "Election has ended");
        _;
    }

    constructor() {
        electionOfficial = msg.sender;
    }

    function addCandidate(string memory name) public onlyOfficial electionOngoing {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, name, 0);
    }

    function vote(uint candidateId) public electionOngoing {
        require(!voters[msg.sender], "Already voted");
        require(candidateId > 0 && candidateId <= candidatesCount, "Invalid candidate");

        voters[msg.sender] = true;
        candidates[candidateId].voteCount++;

        emit Voted(msg.sender, candidateId);
    }

    function endElection() public onlyOfficial {
        electionEnded = true;
        emit ElectionEnded();
    }

    function getWinner() public view returns (string memory) {
        require(electionEnded, "Election still ongoing");

        uint maxVotes = 0;
        uint winnerId;
        for (uint i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerId = i;
            }
        }
        return candidates[winnerId].name;
    }
}
