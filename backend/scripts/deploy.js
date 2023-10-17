const hre = require("hardhat");

async function main() {
  const [owner] = await hre.ethers.getSigners();

  console.log("Deploying Account NFT");
  const account = await hre.ethers.deployContract("Account");
  await account.waitForDeployment();
  console.log(`Account NFT has been deployed at address: ${await account.getAddress()}`);

  for (let i = 0; i < 50; i++) {
    let transaction = await account.mint();
    await transaction.wait();
  }

  console.log("Deploying Marketplace Contract");
  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(await account.getAddress(), 2);
  console.log(`Marketplace contract deployed at address: ${await marketplace.getAddress()}`);

  console.log("Approving NFTs for sale...");
  for (let i = 0; i < 50; i++) {
    let transaction = await account.approve(await marketplace.getAddress(), i);
    await transaction.wait();
  }

  console.log("NFTs approved for sale");

  for (let i = 0; i < 50; i++) {
    let transaction = await marketplace.connect(owner).list(i);
    await transaction.wait();
    console.log(`Listing Account ${i}`);
  }
  console.log("All accounts have been listed!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
