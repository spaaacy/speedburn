const hre = require("hardhat");

async function main() {
  // Get account
  const [owner] = await hre.ethers.getSigners();
  const nftCount = 5;
  const nftPrice = hre.ethers.parseEther("5");

  // Deploy Speedburn nft contract
  console.log("Deploying Speedburn NFT");
  const Speedburn = await hre.ethers.getContractFactory("SpeedBurn");
  const speedburn = await Speedburn.deploy(owner.address);
  console.log(`Speedburn NFT has been deployed at address: ${await speedburn.getAddress()}`);

  // Deploy marketplace contract
  console.log("Deploying Marketplace Contract");
  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(await speedburn.getAddress(), nftPrice);
  console.log(`Marketplace contract deployed at address: ${await marketplace.getAddress()}`);

  // Deploy blog contract
  console.log("Deploying Blog NFT");
  const Blog = await hre.ethers.getContractFactory("Blog");
  const blog = await Blog.deploy(await speedburn.getAddress());
  console.log(`Blog NFT deployed at address: ${await blog.getAddress()}`);

  // Deploy profile contract
  console.log("Deploying Profile Contract");
  const Profile = await hre.ethers.getContractFactory("Profile");
  const profile = await Profile.deploy(await speedburn.getAddress());
  console.log(`Profile contract deployed at address: ${await profile.getAddress()}`);

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

  // Purchase NFT
  console.log("Account #0: Purchasing Speedburn NFT");
  let transaction = await marketplace.connect(owner).purchase(3, { value: nftPrice });
  await transaction.wait();
  console.log("Account #0: Speedburn purchased!");

  // console.log("Account #0: Creating user profile");
  // transaction = await profile.connect(owner).createUser("spacy", "https://is5-ssl.mzstatic.com/image/thumb/Purple128/v4/cf/43/85/cf438590-1e50-4ee2-c0a8-96fa85501abb/source/512x512bb.jpg");
  // transaction.wait();
  // console.log("Account #0: User profile created!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
