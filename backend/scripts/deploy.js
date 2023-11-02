const { ethers } = require("hardhat");

async function main() {
  // Get account
  let transaction;
  const [owner] = await ethers.getSigners();
  const nftCount = 50;
  const nftPrice = ethers.parseEther("5");
  const minDelay = BigInt(1);
  const DEFAULT_ADMIN_ROLE = ethers.ZeroHash;
  const PROPOSER_ROLE = ethers.id("PROPOSER_ROLE");

  // Deploy Speedburn nft contract
  console.log("Deploying Speedburn NFT");
  const Speedburn = await ethers.getContractFactory("SpeedBurn");
  const speedburn = await Speedburn.deploy(owner.address);
  console.log(`Speedburn NFT has been deployed at address: ${await speedburn.getAddress()}`);

  // Deploy marketplace contract
  console.log("Deploying Marketplace Contract");
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(await speedburn.getAddress(), nftPrice);
  console.log(`Marketplace contract deployed at address: ${await marketplace.getAddress()}`);
  // Set marketplace address in NFT contract
  transaction = await speedburn.setMarketplaceAddress(await marketplace.getAddress());
  await transaction.wait();

  // Deploy timelock contract
  console.log("Deploying Timelock Contract");
  const Timelock = await ethers.getContractFactory("Timelock");
  const timelock = await Timelock.deploy(minDelay, [owner.address], [ethers.ZeroAddress], owner.address);
  console.log(`Timelock contract deployed at address: ${await timelock.getAddress()}`);

  // Deploy Colosseum contract
  console.log("Deploying Colosseum Contract");
  const Colosseum = await ethers.getContractFactory("Colosseum");
  const colosseum = await Colosseum.deploy(await speedburn.getAddress(), await timelock.getAddress());
  console.log(`Colosseum contract deployed at address: ${await colosseum.getAddress()}`);

  // Grant governance contract proposer role and revoke owner address as admin
  console.log("Granting Colosseum proposer role in timelock contract...");
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

  // Mint Speedburn NFTs
  for (let i = 0; i < nftCount; i++) {
    let transaction = await speedburn.safeMint(owner.address);
    await transaction.wait();
  }

  // Approve NFTs for transfer
  console.log("Approving NFTs for transfer...");
  for (let i = 0; i < nftCount; i++) {
    let transaction = await speedburn.approve(await marketplace.getAddress(), i);
    await transaction.wait();
  }
  console.log("NFTs approved for transfer");
  // List NFTs on marketplace
  console.log("Listing NFTs on marketplace...");
  for (let i = 0; i < nftCount; i++) {
    let transaction = await marketplace.connect(owner).list(i);
    await transaction.wait();
  }
  console.log("All NFTs have been listed!");

  // // Purchase NFT
  // console.log("Account #0: Purchasing Speedburn NFT");
  // transaction = await marketplace.connect(owner).purchase(3, { value: nftPrice });
  // await transaction.wait();
  // console.log("Account #0: Speedburn purchased!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
