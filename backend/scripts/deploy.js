const hre = require("hardhat");

async function main() {
  // Get account
  const [owner] = await hre.ethers.getSigners();

  // Deploy account nft contract
  console.log("Deploying Account NFT");
  const account = await hre.ethers.deployContract("Account");
  await account.waitForDeployment();
  console.log(`Account NFT has been deployed at address: ${await account.getAddress()}`);

  // Deploy marketplace contract
  console.log("Deploying Marketplace Contract");
  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(await account.getAddress(), 2);
  console.log(`Marketplace contract deployed at address: ${await marketplace.getAddress()}`);

  // Deploy blog contract
  console.log("Deploying Blog NFT");
  const blog = await hre.ethers.deployContract("Blog");
  await blog.waitForDeployment();
  console.log(`Blog NFT deployed at address: ${await blog.getAddress()}`);

  // Mint 50 account NFTs
  for (let i = 0; i < 50; i++) {
    let transaction = await account.mint();
    await transaction.wait();
  }

  // Approve NFTs for transfer
  console.log("Approving NFTs for transfer...");
  for (let i = 0; i < 50; i++) {
    let transaction = await account.approve(await marketplace.getAddress(), i);
    await transaction.wait();
  }
  console.log("NFTs approved for transfer");
  // List NFTs on marketplace
  console.log("Listing NFTs on marketplace...");
  for (let i = 0; i < 50; i++) {
    let transaction = await marketplace.connect(owner).list(i);
    await transaction.wait();
  }
  console.log("All accounts have been listed!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
