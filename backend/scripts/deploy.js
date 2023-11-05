const { ethers } = require("hardhat");
const { mine } = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  // Get account
  let transaction;
  const [owner] = await ethers.getSigners();
  const nftCount = 10;
  const nftPrice = ethers.parseEther("5");
  const minDelay = BigInt(1);
  const DEFAULT_ADMIN_ROLE = ethers.ZeroHash;
  const PROPOSER_ROLE = ethers.id("PROPOSER_ROLE");
  const constitution = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Vestibulum quis mi bibendum, finibus augue fermentum, lobortis sapien.",
    "Vivamus eu lacus eu tortor tincidunt facilisis. Fusce at tortor ac leo malesuada lobortis.",
    "Nunc in ex commodo, pellentesque libero rutrum, pulvinar erat. Sed efficitur vel sem quis rhoncus. ",
    "Duis tortor magna, finibus id fringilla et, convallis at elit. In luctus sagittis nunc, id feugiat nulla fermentum vitae.",
    "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
  ];

  // Deploy Speedburn nft contract
  console.log("\nDeploying Speedburn NFT");
  const Speedburn = await ethers.getContractFactory("SpeedBurn");
  const speedburn = await Speedburn.deploy(owner.address, constitution);
  console.log(`Speedburn NFT has been deployed at address: ${await speedburn.getAddress()}`);

  // Deploy marketplace contract
  console.log("\nDeploying Marketplace Contract");
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(await speedburn.getAddress(), nftPrice);
  console.log(`Marketplace contract deployed at address: ${await marketplace.getAddress()}`);
  // Set marketplace address in NFT contract
  transaction = await speedburn.setMarketplaceAddress(await marketplace.getAddress());
  await transaction.wait();

  // Deploy timelock contract
  console.log("\nDeploying Timelock Contract");
  const Timelock = await ethers.getContractFactory("Timelock");
  const timelock = await Timelock.deploy(minDelay, [owner.address], [ethers.ZeroAddress], owner.address);
  console.log(`Timelock contract deployed at address: ${await timelock.getAddress()}`);

  // Deploy Colosseum contract
  console.log("\nDeploying Colosseum Contract");
  const Colosseum = await ethers.getContractFactory("Colosseum");
  const colosseum = await Colosseum.deploy(await speedburn.getAddress(), await timelock.getAddress());
  console.log(`Colosseum contract deployed at address: ${await colosseum.getAddress()}`);

  // Grant governance contract proposer role and revoke owner address as admin
  console.log("\nGranting Colosseum proposer role in timelock contract...");
  transaction = await timelock.grantRole(PROPOSER_ROLE, await colosseum.getAddress());
  await transaction.wait();
  console.log("Role granted!");
  console.log("Revoking deploying address as timelock contract proposer...");
  transaction = await timelock.revokeRole(PROPOSER_ROLE, owner.address);
  await transaction.wait();
  console.log("Role revoked!");
  console.log("Revoking deploying address as timelock contract admin...");
  transaction = await timelock.revokeRole(DEFAULT_ADMIN_ROLE, owner.address);
  await transaction.wait();
  console.log("Role revoked!");
  console.log(`Is owner admin? ${await timelock.hasRole(DEFAULT_ADMIN_ROLE, owner.address)}`);
  console.log(`Is owner proposer? ${await timelock.hasRole(PROPOSER_ROLE, owner.address)}`);
  console.log(`Is Colosseum proposer? ${await timelock.hasRole(PROPOSER_ROLE, await colosseum.getAddress())}`);

  // TODO: Delegate tokens

  // Mint Speedburn NFTs
  console.log("\nMinting NFTs...");
  for (let i = 0; i < nftCount; i++) {
    let transaction = await speedburn.safeMint(owner.address);
    await transaction.wait();
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
    let transaction = await marketplace.connect(owner).list(i);
    await transaction.wait();
  }
  console.log("All NFTs have been listed!");

  // Transfer SpeedBurn ownership
  console.log("\nTransferring SpeedBurn contract ownership to Colosseum");
  console.log(`Is deploying address owner of SpeedBurn? ${await speedburn.owner() == owner.address}`);
  console.log(`Is Colosseum owner of SpeedBurn? ${await speedburn.owner() == await colosseum.getAddress()}`);
  transaction = await speedburn.transferOwnership(await colosseum.getAddress());
  console.log(`Is deploying address owner of SpeedBurn? ${await speedburn.owner() == owner.address}`);
  console.log(`Is Colosseum owner of SpeedBurn? ${await speedburn.owner() == await colosseum.getAddress()}`);
  
  console.log("\nMining 10 blocks...");
  mine(10);
  console.log("Blocks mined!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
