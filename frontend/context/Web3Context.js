"use client";

import React, { useEffect, useState } from "react";
import config from "@/public/config.json";
import accountArtifact from "@/public/abi/Account.json";
import marketplaceArtifact from "@/public/abi/Marketplace.json";
import blogArtifact from "@/public/abi/Blog.json";
import { ethers } from "ethers";

export const Web3Context = React.createContext();

export const Web3Provider = ({ children }) => {
  const { abi: accountAbi } = accountArtifact;
  const { abi: marketplaceAbi } = marketplaceArtifact;
  const { abi: blogAbi } = blogArtifact;

  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [marketplace, setMarketplace] = useState(null);
  const [accountNFT, setAccountNFT] = useState(null);
  const [blog, setBlog] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (window.ethereum == null) {
      setProvider(new ethers.getDefaultProvider());
    } else {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    }

    const accountNFT = new ethers.Contract(config.account.address, accountAbi, provider);
    setAccountNFT(accountNFT);
    const marketplace = new ethers.Contract(config.marketplace.address, marketplaceAbi, provider);
    setMarketplace(marketplace);
    const blog = new ethers.Contract(config.blog.address, blogAbi, provider);
    setBlog(blog);
  }, []);

  const purchaseAccount = async (id) => {
    if (!accountNFT || !account) return;
    const signer = await provider.getSigner();
    const transaction = await marketplace.connect(signer).purchase(id, { value: 2 });
    await transaction.wait();
  };

  const getPosts = async () => {
    const posts = [];
    const signer = await provider.getSigner();
    const totalPosts = await blog.connect(signer).nextPostId();
    for (let i = 0; i < totalPosts; i++) {
      const post = await blog.connect(signer).posts(i);
      posts.push(post);
    }
    setPosts(posts);
    console.log(posts);
  }
  
  const createPost = async (post) => {
    const { title, body } = post;
    const signer = await provider.getSigner();
    const transaction = await blog.connect(signer).mintPost(title, body, Date.now());
    await transaction.wait();
  };

  const signIn = async () => {
    if (!accountNFT) return;
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
    const signer = await provider.getSigner();
    setIsRegistered(await accountNFT.connect(signer).balanceOf(accounts[0]));
  };

  const signOut = () => {
    setAccount(null);
  };

  const retrieveListings = async (updateListedItems) => {
    if (!marketplace || !accountNFT) return;
    const signer = await provider.getSigner();
    const totalAccountNFTs = await accountNFT.connect(signer).nextTokenId();
    for (let i = 0; i < totalAccountNFTs; i++) {
      if (await marketplace.connect(signer).isListed(i)) {
        updateListedItems(i);
      }
    }
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        marketplace,
        accountNFT,
        blog,
        posts,
        retrieveListings,
        purchaseAccount,
        signIn,
        signOut,
        createPost,
        getPosts,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
