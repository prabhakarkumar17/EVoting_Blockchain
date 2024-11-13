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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "candidateIndex",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getCandidate",
		"outputs": [
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
		"name": "getCandidateCount",
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
		"name": "getCandidates",
		"outputs": [
			{
				"components": [
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
				"internalType": "struct Voting.Candidate[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
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
]
const contractAddress = "0xDfC17A22CA4BC0d455b7c1238268a676c2F78b1a";

let web3;
let votingContract;

window.addEventListener("load", async () => {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        votingContract = new web3.eth.Contract(contractABI, contractAddress);
        loadCandidates();
    } else {
        alert("Please install MetaMask to use this application.");
    }
});

async function addCandidate() {
    const name = document.getElementById("candidateName").value;
    const accounts = await web3.eth.getAccounts();
    try {
        await votingContract.methods.addCandidate(name).send({ from: accounts[0] });
        alert("Candidate added successfully!");
        loadCandidates();
    } catch (error) {
        console.error(error);
        alert("Failed to add candidate.");
    }
}

async function voteForCandidate() {
    const candidateIndex = document.getElementById("candidateList").value;
    const accounts = await web3.eth.getAccounts();
    try {
        await votingContract.methods.vote(candidateIndex).send({ from: accounts[0] });
        alert("Vote cast successfully!");
        loadCandidates();
    } catch (error) {
        console.error(error);
        alert("Failed to cast vote.");
    }
}

async function loadCandidates() {
    const candidateCount = await votingContract.methods.getCandidateCount().call();
    const candidateListDropdown = document.getElementById("candidateList");
    const candidatesDisplay = document.getElementById("candidatesDisplay");
    candidateListDropdown.innerHTML = "";
    candidatesDisplay.innerHTML = "";

    for (let i = 0; i < candidateCount; i++) {
        const candidate = await votingContract.methods.getCandidate(i).call();
        const option = document.createElement("option");
        option.value = i;
        option.textContent = `${candidate.name}`;
        candidateListDropdown.appendChild(option);

        const listItem = document.createElement("li");
        listItem.textContent = `${candidate.name} - Votes: ${candidate.voteCount}`;
        candidatesDisplay.appendChild(listItem);
    }
}
