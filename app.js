// Initialize Web3
if (typeof window.ethereum !== 'undefined') {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // Request account access if needed
} else {
    console.log("Please install MetaMask!");
}

// Replace with your contract's ABI and deployed address
const contractABI = [/* ABI from compiled smart contract */];
const contractAddress = "0xYourContractAddress";

const votingContract = new web3.eth.Contract(contractABI, contractAddress);

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
    await votingContract.methods.vote(candidateId).send({ from: accounts[0] });
    alert("Vote cast successfully!");
    loadCandidates();
}

// End election function
async function endElection() {
    const accounts = await web3.eth.getAccounts();
    await votingContract.methods.endElection().send({ from: accounts[0] });
    alert("Election ended!");
}

// Get the winner
async function getWinner() {
    const winner = await votingContract.methods.getWinner().call();
    document.getElementById("winner").innerText = `Winner: ${winner}`;
}

// Load candidates initially
loadCandidates();
