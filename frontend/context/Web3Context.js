"use client";

import { createContext, useEffect, useState } from "react";
import config from "@/public/config.json";
import speedburnArtifact from "@/public/abi/SpeedBurn.json";
import marketplaceArtifact from "@/public/abi/Marketplace.json";
import { ethers } from "ethers";

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  // Contract ABIs
  const { abi: speedburnAbi } = speedburnArtifact;
  const { abi: marketplaceAbi } = marketplaceArtifact;

  // Misc
  const nftPrice = ethers.parseEther("5");
  const [isContextInitialized, setIsContextInitialized] = useState(false);
  const [provider, setProvider] = useState(null);
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
  // const [blogContract, setBlogContract] = useState(null);
  // const [profileContract, setProfileContract] = useState(null);

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
      // const blogContract = new ethers.Contract(config.blog.address, blogAbi, provider);
      // setBlogContract(blogContract);
      // const profileContract = new ethers.Contract(config.profile.address, profileAbi, provider);
      // setProfileContract(profileContract);

      // Account change listener
      window.ethereum.on("accountsChanged", async () => {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
        window.location.reload();
      });

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

  const listNFT = async () => {
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
    // const posts = [];
    // const users = {};
    // const totalPosts = await blogContract.nextPostId();
    // for (let i = 0; i < totalPosts; i++) {
    //   const post = await blogContract.posts(i);
    //   if (!users[post[3]]) {
    //     const user = await profileContract.profiles(post[3]);
    //     users[post[3]] = user;
    //   }
    //   posts.push(post);
    // }
    // setPosts(posts);
    // setProfileCache(users);
  };

  const signIn = async () => {
    if (!isContextInitialized) return;

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
    const isRegistered = await speedburnContract.balanceOf(accounts[0]);
    setIsRegistered(isRegistered);

    // Fetch user from MongoDB
    const response = await fetch(`/api/users/${accounts[0]}`, {
      method: "GET",
    });
    const result = await response.json();
    if (result) {
      setUsername(result.username);
      setDisplayPicture(result.image);
    }

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

  return (
    <Web3Context.Provider
      value={{
        isContextInitialized,
        account,
        isRegistered,
        username,
        displayPicture,
        listedAccounts,
        tokenOwned,
        retrieveListings,
        purchaseNFT,
        signIn,
        signOut,
        listNFT,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
