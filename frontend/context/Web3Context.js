"use client";

import { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import config from "@/public/contracts";

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
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
  const [colosseumContract, setColosseumContract] = useState(null);

  const initializeContext = async () => {
    let provider;
    try {
      if (window.ethereum == null) {
        provider = new ethers.getDefaultProvider();
      } else {
        provider = new ethers.BrowserProvider(window.ethereum);
      }
      setProvider(provider);

      // Initialize contracts
      const speedburnContract = new ethers.Contract(config.address.speedburn, config.speedburn, provider);
      setSpeedBurnContract(speedburnContract);
      const marketplaceContract = new ethers.Contract(config.address.marketplace, config.marketplace, provider);
      setMarketplaceContract(marketplaceContract);
      const colosseumContract = new ethers.Contract(config.address.colosseum, config.colosseum, provider);
      setColosseumContract(colosseumContract);

      // Account change listener
      window.ethereum.on("accountsChanged", async () => {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
        window.location.reload();
      });

      setIsContextInitialized(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
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
      let transaction = await speedburnContract.connect(signer).approve(config.address.marketplace, tokenId);
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

  const signIn = async () => {
    if (!isContextInitialized) return;

    try {
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
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = () => {
    setAccount(null);
    setIsRegistered(false);
    setUsername("");
    setDisplayPicture("");
  };

  const retrieveListings = async () => {
    if (!isContextInitialized) return;
    try {
      setListedAccounts([]);
      const totalAccountNFTs = await speedburnContract.totalSupply();
      for (let i = 0; i < totalAccountNFTs; i++) {
        if (await marketplaceContract.isListed(i)) {
          setListedAccounts((prevAccounts) => [...prevAccounts, i]);
        }
      }
    } catch (error) {
      console.error(error);
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
