// Initialize Web3
if (typeof window.ethereum !== 'undefined') {
    window.Web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // Request account access if needed
} else {
    console.log("Please install MetaMask!");
}

const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "addCandidate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "ElectionEnded",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "endElection",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "candidateId",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "candidateId",
				"type": "uint256"
			}
		],
		"name": "Voted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidates",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "candidatesCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "electionEnded",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "electionOfficial",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getWinner",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "voters",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const contractAddress = "0x94320CEFc93f525AAF941088797bAA3407706CDf";

const votingContract = new Web3.eth.Contract(contractABI, contractAddress);

// Display all candidates
async function loadCandidates() {
    const candidatesCount = await votingContract.methods.candidatesCount().call();
    const candidatesDiv = document.getElementById("candidates");
    candidatesDiv.innerHTML = "";

    for (let i = 1; i <= candidatesCount; i++) {
        const candidate = await votingContract.methods.candidates(i).call();
        candidatesDiv.innerHTML += `<p>ID: ${candidate.id}, Name: ${candidate.name}, Votes: ${candidate.voteCount}</p>`;
    }
}

// Voting function
async function vote() {
    const candidateId = document.getElementById("candidateId").value;
    const accounts = await web3.eth.getAccounts();
    await votingContract.methods.vote(candidateId).send({ from: "0xb2b53e9b86891b5224a13f2f9f31d6dabe56820a" });
    alert("Vote cast successfully!");
    loadCandidates();
}

// End election function
async function endElection() {
    const accounts = await web3.eth.getAccounts();
    await votingContract.methods.endElection().send({ from: "0xb2b53e9b86891b5224a13f2f9f31d6dabe56820a" });
    alert("Election ended!");
}

// Get the winner
async function getWinner() {
    const winner = await votingContract.methods.getWinner().call();
    document.getElementById("winner").innerText = `Winner: ${winner}`;
}

// Load candidates initially
loadCandidates();
