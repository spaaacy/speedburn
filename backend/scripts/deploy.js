const { ethers } = require("hardhat");
const { mine } = require("@nomicfoundation/hardhat-network-helpers");


async function main() {

  let transaction;
  let speedburn;
  let marketplace;
  let colosseum;
  let timelock;
  
  const nftCount = 10;
  const nftPrice = ethers.parseEther("5");
  const minDelay = BigInt(1);
  const [address0, address1, address2] = await ethers.getSigners();

  const constitution = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Vestibulum quis mi bibendum, finibus augue fermentum, lobortis sapien.",
    "Vivamus eu lacus eu tortor tincidunt facilisis. Fusce at tortor ac leo malesuada lobortis.",
    "Nunc in ex commodo, pellentesque libero rutrum, pulvinar erat. Sed efficitur vel sem quis rhoncus. ",
    "Duis tortor magna, finibus id fringilla et, convallis at elit. In luctus sagittis nunc, id feugiat nulla fermentum vitae.",
    "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
  ];

  const amendments = [
    "Amendment 1",
    "Amendment 2",
    "Amendment 3",]

  const deployContracts = async () => {
    // Deploy Speedburn nft contract
    console.log("\nDeploying Speedburn NFT");
    const Speedburn = await ethers.getContractFactory("SpeedBurn");
    speedburn = await Speedburn.deploy(address0.address, constitution);
    console.log(`Speedburn NFT has been deployed at address: ${await speedburn.getAddress()}`);

    // Deploy marketplace contract
    console.log("\nDeploying Marketplace Contract");
    const Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy(await speedburn.getAddress(), nftPrice);
    console.log(`Marketplace contract deployed at address: ${await marketplace.getAddress()}`);
    // Set marketplace address in NFT contract
    transaction = await speedburn.setMarketplaceAddress(await marketplace.getAddress());
    await transaction.wait();

    // Deploy timelock contract
    console.log("\nDeploying Timelock Contract");
    const Timelock = await ethers.getContractFactory("Timelock");
    timelock = await Timelock.deploy(minDelay, [address0.address], [ethers.ZeroAddress], address0.address);
    console.log(`Timelock contract deployed at address: ${await timelock.getAddress()}`);

    // Deploy Colosseum contract
    console.log("\nDeploying Colosseum Contract");
    const Colosseum = await ethers.getContractFactory("Colosseum");
    colosseum = await Colosseum.deploy(await speedburn.getAddress(), await timelock.getAddress());
    console.log(`Colosseum contract deployed at address: ${await colosseum.getAddress()}`);
  }

  const grantTimelockRoles = async () => {
    const DEFAULT_ADMIN_ROLE = ethers.ZeroHash;
    const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
    const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE();
    console.log("\nGranting Colosseum proposer role in timelock contract...");
    transaction = await timelock.grantRole(PROPOSER_ROLE, await colosseum.getAddress());
    await transaction.wait();
    console.log("Role granted!");
    console.log("\nGranting Colosseum executor role in timelock contract...");
    transaction = await timelock.grantRole(EXECUTOR_ROLE, await colosseum.getAddress());
    await transaction.wait();
    console.log("Role granted!");
    console.log("Revoking deploying address as timelock contract proposer...");
    transaction = await timelock.revokeRole(PROPOSER_ROLE, address0.address);
    await transaction.wait();
    console.log("Role revoked!");
    console.log("Revoking deploying address as timelock contract admin...");
    transaction = await timelock.revokeRole(DEFAULT_ADMIN_ROLE, address0.address);
    await transaction.wait();
    console.log("Role revoked!");
    console.log(`Is owner admin? ${await timelock.hasRole(DEFAULT_ADMIN_ROLE, address0.address)}`);
    console.log(`Is owner proposer? ${await timelock.hasRole(PROPOSER_ROLE, address0.address)}`);
    console.log(`Is Colosseum proposer? ${await timelock.hasRole(PROPOSER_ROLE, await colosseum.getAddress())}`);
    console.log(`Is Colosseum executor? ${await timelock.hasRole(EXECUTOR_ROLE, await colosseum.getAddress())}`);
  }
  const mintAndListSpeedburn = async () => {
    // Mint Speedburn NFTs
    console.log("\nMinting NFTs...");
    for (let i = 0; i < nftCount; i++) {
      let transaction = await speedburn.safeMint(address0.address);
      await transaction.wait(); ``
    }
    console.log("NFTs minted!");

    // Approve NFTs for transfer
    console.log("\nApproving NFTs for transfer...");
    for (let i = 0; i < nftCount; i++) {
      transaction = await speedburn.approve(await marketplace.getAddress(), i);
      await transaction.wait();
    }
    console.log("\nNFTs approved for transfer");

    // List NFTs on marketplace
    console.log("Listing NFTs on marketplace...");
    for (let i = 0; i < nftCount; i++) {
      let transaction = await marketplace.connect(address0).list(i);
      await transaction.wait();
    }
    console.log("All NFTs have been listed!");
  }

  const mintAndDelegateToAccounts = async () => {
    console.log("\nMinting and delegating token to address #0... ");
    transaction = await speedburn.safeMint(address0.address)
    await transaction.wait()
    transaction = await speedburn.connect(address0).delegate(address0.address);
    await transaction.wait()
    console.log("Token has been minted and delegated!");
    console.log("Minting and delegating token to address #1... ");
    transaction = await speedburn.safeMint(address1.address)
    await transaction.wait()
    transaction = await speedburn.connect(address1).delegate(address1.address);
    await transaction.wait()
    console.log("Token has been minted and delegated!");
    console.log("Minting and delegating token to address #2... ");
    transaction = await speedburn.safeMint(address2.address)
    await transaction.wait()
    transaction = await speedburn.connect(address2).delegate(address2.address);
    await transaction.wait()
    console.log("Token has been minted and delegated!");
  }

  const createProposals = async () => {
    console.log("\nCreating proposals...");
    const calldata1 = speedburn.interface.encodeFunctionData("amendConstitution", [amendments[0]]);
    const calldata2 = speedburn.interface.encodeFunctionData("amendConstitution", [amendments[1]]);
    const calldata3 = speedburn.interface.encodeFunctionData("amendConstitution", [amendments[2]]);
    transaction = await colosseum.propose([await speedburn.getAddress()], [0], [calldata1], amendments[0]);
    let receipt = await transaction.wait();
    console.log(`Proposal 1 ID: ${receipt.logs[0].args.proposalId}`);
    transaction = await colosseum.propose([await speedburn.getAddress()], [0], [calldata2], amendments[1]);
    receipt = await transaction.wait();
    console.log(`Proposal 2 ID: ${receipt.logs[0].args.proposalId}`);
    transaction = await colosseum.propose([await speedburn.getAddress()], [0], [calldata3], amendments[2]);
    receipt = await transaction.wait();
    console.log(`Proposal 3 ID: ${receipt.logs[0].args.proposalId}`);
    console.log("Proposals created!");
  }

  const grantColosseumOwnershipToSpeedburn = async () => {
    console.log("\nTransferring SpeedBurn contract ownership to Timelock");
    console.log(`Is deploying address owner of SpeedBurn? ${(await speedburn.owner()) == address0.address}`);
    console.log(`Is Timelock owner of SpeedBurn? ${(await speedburn.owner()) == (await timelock.getAddress())}`);
    transaction = await speedburn.transferOwnership(await timelock.getAddress());
    console.log(`Is deploying address owner of SpeedBurn? ${(await speedburn.owner()) == address0.address}`);
    console.log(`Is Timelock owner of SpeedBurn? ${(await speedburn.owner()) == (await timelock.getAddress())}`);
  }

  // Execution
  await deployContracts();
  await grantTimelockRoles();
  await mintAndListSpeedburn();
  await grantColosseumOwnershipToSpeedburn();

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});