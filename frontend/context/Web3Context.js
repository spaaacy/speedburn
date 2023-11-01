"use client";

import { createContext, useEffect, useState } from "react";
import config from "@/public/config.json";
import speedburnArtifact from "@/public/abi/SpeedBurn.json";
import marketplaceArtifact from "@/public/abi/Marketplace.json";
import blogArtifact from "@/public/abi/Blog.json";
import profileArtifact from "@/public/abi/Profile.json";
import { ethers } from "ethers";

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  // Contract ABIs
  const { abi: speedburnAbi } = speedburnArtifact;
  const { abi: marketplaceAbi } = marketplaceArtifact;
  const { abi: blogAbi } = blogArtifact;
  const { abi: profileAbi } = profileArtifact;

  // Misc
  const nftPrice = ethers.parseEther("5");
  const [isContextInitialized, setIsContextInitialized] = useState(false);
  const [provider, setProvider] = useState(null);
  const [posts, setPosts] = useState([]);
  const [profileCache, setProfileCache] = useState({});
  const [listedAccounts, setListedAccounts] = useState([]);

  // User
  const [account, setAccount] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [username, setUsername] = useState(null);
  const [displayPicture, setDisplayPicture] = useState(null);
  const [tokenOwned, setTokenOwned] = useState(null);

  // Contracts
  const [marketplaceContract, setMarketplaceContract] = useState(null);
  const [speedburnContract, setSpeedBurnContract] = useState(null);
  const [blogContract, setBlogContract] = useState(null);
  const [profileContract, setProfileContract] = useState(null);

  useEffect(() => {
    const initializeContext = async () => {
      let provider;
      if (window.ethereum == null) {
        provider = new ethers.getDefaultProvider();
      } else {
        provider = new ethers.BrowserProvider(window.ethereum);
      }
      setProvider(provider);

      // Initialize contracts
      const speedburnContract = new ethers.Contract(config.account.address, speedburnAbi, provider);
      setSpeedBurnContract(speedburnContract);
      const marketplaceContract = new ethers.Contract(config.marketplace.address, marketplaceAbi, provider);
      setMarketplaceContract(marketplaceContract);
      const blogContract = new ethers.Contract(config.blog.address, blogAbi, provider);
      setBlogContract(blogContract);
      const profileContract = new ethers.Contract(config.profile.address, profileAbi, provider);
      setProfileContract(profileContract);

      setIsContextInitialized(true);
    };

    if (isContextInitialized) {
      signIn();
    } else {
      initializeContext();
    }
  }, [isContextInitialized]);

  const purchaseNFT = async (id) => {
    if (!isContextInitialized) return;
    const signer = await provider.getSigner();
    try {
      const transaction = await marketplaceContract.connect(signer).purchase(id, { value: nftPrice });
      await transaction.wait();
      setIsRegistered(await speedburnContract.balanceOf(account));
      await retrieveListings();
    } catch (error) {
      console.error(error);
    }
  };

  const listAccount = async () => {
    const signer = await provider.getSigner();
    const tokenId = await speedburnContract.tokenOfOwnerByIndex(account, 0);
    try {
      // Approving transfer
      console.log("Approving transfer...");
      let transaction = await speedburnContract.connect(signer).approve(config.marketplace.address, tokenId);
      await transaction.wait();
      console.log("Tranfer approved!");

      // Transfer NFT
      console.log("Listing NFT...");
      transaction = await marketplaceContract.connect(signer).list(tokenId);
      await transaction.wait();
      console.log("NFT Listed!");

      setIsRegistered(false);
      await retrieveListings();
    } catch (error) {
      console.error(error);
    }
  };

  const getPosts = async () => {
    const posts = [];
    const users = {};
    const totalPosts = await blogContract.nextPostId();
    for (let i = 0; i < totalPosts; i++) {
      const post = await blogContract.posts(i);
      if (!users[post[3]]) {
        const user = await profileContract.profiles(post[3]);
        users[post[3]] = user;
      }
      posts.push(post);
    }
    setPosts(posts);
    setProfileCache(users);
  };

  const createUser = async (user) => {
    if (!profileContract || !isRegistered) return;
    const { username, imageURL } = user;
    console.log({ username, imageURL });
    const signer = await provider.getSigner();
    const transaction = await profileContract.connect(signer).createUser(username, imageURL);
    await transaction.wait();
  };

  const signIn = async () => {
    if (!isContextInitialized) return;

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
    const isRegistered = await speedburnContract.balanceOf(accounts[0]);
    setIsRegistered(isRegistered);
    const user = await profileContract.profiles(accounts[0]);
    setUsername(user[0]);
    setDisplayPicture(user[1]);

    if (!isRegistered) return;
    const tokenOwned = await speedburnContract.tokenOfOwnerByIndex(accounts[0], 0);
    setTokenOwned(tokenOwned);
  };

  const signOut = () => {
    setAccount(null);
    setIsRegistered(false);
    setUsername("");
    setDisplayPicture("");
  };

  const retrieveListings = async () => {
    if (!isContextInitialized) return;
    setListedAccounts([]);
    const totalAccountNFTs = await speedburnContract.totalSupply();
    for (let i = 0; i < totalAccountNFTs; i++) {
      if (await marketplaceContract.isListed(i)) {
        setListedAccounts((prevAccounts) => [...prevAccounts, i]);
      }
    }
  };

  const changeDisplayPicture = async (imageURL) => {
    if (!isContextInitialized) return;
    const signer = await provider.getSigner();
    const transaction = await profileContract.connect(signer).setDisplayPicture(imageURL);
    await transaction.wait();
    setDisplayPicture(imageURL);
  };

  const changeUsername = async (username) => {
    if (!isContextInitialized) return;
    const signer = await provider.getSigner();
    const transaction = await profileContract.connect(signer).setUsername(username);
    await transaction.wait();
    setUsername(username);
  };

  return (
    <Web3Context.Provider
      value={{
        isContextInitialized,
        account,
        posts,
        profileCache,
        isRegistered,
        username,
        displayPicture,
        listedAccounts,
        tokenOwned,
        retrieveListings,
        purchaseNFT,
        signIn,
        signOut,
        getPosts,
        createUser,
        changeDisplayPicture,
        changeUsername,
        listAccount,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
