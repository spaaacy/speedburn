const hre = require("hardhat");

async function main() {
  // Get account
  const [owner] = await hre.ethers.getSigners();
  const nftCount = 5;

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
  const Blog = await hre.ethers.getContractFactory("Blog");
  const blog = await Blog.deploy(await account.getAddress());
  console.log(`Blog NFT deployed at address: ${await blog.getAddress()}`);

  // Deploy profile contract
  console.log("Deploying Profile Contract");
  const Profile = await hre.ethers.getContractFactory("Profile");
  const profile = await Profile.deploy(await account.getAddress());
  console.log(`Profile contract deployed at address: ${await profile.getAddress()}`);

  // Mint 50 account NFTs
  for (let i = 0; i < nftCount; i++) {
    let transaction = await account.mint();
    await transaction.wait();
  }

  // Approve NFTs for transfer
  console.log("Approving NFTs for transfer...");
  for (let i = 0; i < nftCount; i++) {
    let transaction = await account.approve(await marketplace.getAddress(), i);
    await transaction.wait();
  }
  console.log("NFTs approved for transfer");
  // List NFTs on marketplace
  console.log("Listing NFTs on marketplace...");
  for (let i = 0; i < nftCount; i++) {
    let transaction = await marketplace.connect(owner).list(i);
    await transaction.wait();
  }
  console.log("All accounts have been listed!");

  // Purchase account
  console.log("Account #0: Purchasing account NFT");
  let transaction = await marketplace.connect(owner).purchase(0, {value: 2});
  await transaction.wait();
  console.log("Account #0: Account purchased!");
  console.log("Account #0: Creating user profile");
  transaction = await profile.connect(owner).createUser("spacy", "https://is5-ssl.mzstatic.com/image/thumb/Purple128/v4/cf/43/85/cf438590-1e50-4ee2-c0a8-96fa85501abb/source/512x512bb.jpg");
  transaction.wait();
  console.log("Account #0: User profile created!");
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
