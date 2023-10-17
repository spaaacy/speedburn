"use client";

import React, { useState } from "react";
import config from "@/public/config.json";
import accountContract from "@/public/abi/Account.json";
import marketplaceContract from "@/public/abi/Marketplace.json";
import { ethers } from "ethers";

export const Web3Context = React.createContext();

export const Web3Provider = ({ children }) => {
  const { abi: accountAbi } = accountContract;
  const { abi: marketplaceAbi } = marketplaceContract;

  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [marketplace, setMarketplace] = useState(null);
  const [accountNFT, setAccountNFT] = useState(null);

  const purchaseAccount = async (id) => {
    if (accountNFT && account) {
      const signer = await provider.getSigner();
      console.log(await accountNFT.connect(signer).ownerOf(id));
      const transaction = await marketplace.connect(signer).purchase(id, {value: 2});
      await transaction.wait();
      console.log(await accountNFT.connect(signer).ownerOf(id));
      // const transaction = await accountNFT.connect(signer).transferFrom(await accountNFT.connect(signer).ownerOf(id), account, id);
      // await transaction.wait();
    }
  };

  const initializeContracts = () => {
    const accountNFT = new ethers.Contract(config.account.address, accountAbi, provider);
    setAccountNFT(accountNFT);
    const marketplace = new ethers.Contract(config.marketplace.address, marketplaceAbi, provider);
    setMarketplace(marketplace);
  };

  const retrieveListings = async (updateListedItems) => {
    if (marketplace && accountNFT) {
      const signer = await provider.getSigner();
      const totalAccountNFTs = await accountNFT.connect(signer).nextTokenId();
      for (let i = 0; i < totalAccountNFTs; i++) {
        if (await marketplace.connect(signer).isListed(i)) {
          updateListedItems(i);
        }
      }
    }
  };

  return (
    <Web3Context.Provider
      value={{
        provider,
        setProvider,
        account,
        setAccount,
        marketplace,
        accountNFT,
        initializeContracts,
        retrieveListings,
        purchaseAccount,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
