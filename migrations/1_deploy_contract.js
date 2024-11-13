const EvotingContract = artifacts.require("evoting");

module.exports = function (deployer) {
  deployer.deploy(EvotingContract);
};
