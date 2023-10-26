"use client";

import React, { useEffect, useState } from "react";
import config from "@/public/config.json";
import accountArtifact from "@/public/abi/Account.json";
import marketplaceArtifact from "@/public/abi/Marketplace.json";
import blogArtifact from "@/public/abi/Blog.json";
import profileArtifact from "@/public/abi/Profile.json";
import { ethers } from "ethers";

export const Web3Context = React.createContext();

export const Web3Provider = ({ children }) => {
  // Contract ABIs
  const { abi: accountAbi } = accountArtifact;
  const { abi: marketplaceAbi } = marketplaceArtifact;
  const { abi: blogAbi } = blogArtifact;
  const { abi: profileAbi } = profileArtifact;

  // Misc
  const [provider, setProvider] = useState(null);
  const [posts, setPosts] = useState([]);
  const [profileCache, setProfileCache] = useState({});

  // User
  const [account, setAccount] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [username, setUsername] = useState("");
  const [imageURL, setImageURL] = useState("");
  
  // Contracts
  const [marketplace, setMarketplace] = useState(null);
  const [accountNFT, setAccountNFT] = useState(null);
  const [blog, setBlog] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (window.ethereum == null) {
      setProvider(new ethers.getDefaultProvider());
    } else {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    }

    // Initialize contracts
    const accountNFT = new ethers.Contract(config.account.address, accountAbi, provider);
    setAccountNFT(accountNFT);
    const marketplace = new ethers.Contract(config.marketplace.address, marketplaceAbi, provider);
    setMarketplace(marketplace);
    const blog = new ethers.Contract(config.blog.address, blogAbi, provider);
    setBlog(blog);
    const profile = new ethers.Contract(config.profile.address, profileAbi, provider);
    setProfile(profile);
  }, []);

  const purchaseAccount = async (id) => {
    if (!accountNFT || !account) return;
    const signer = await provider.getSigner();
    const transaction = await marketplace.connect(signer).purchase(id, { value: 2 });
    await transaction.wait();
  };

  const getPosts = async () => {
    const posts = [];
    const users = {};
    const signer = await provider.getSigner();
    const totalPosts = await blog.connect(signer).nextPostId();
    for (let i = 0; i < totalPosts; i++) {
      const post = await blog.connect(signer).posts(i);
      if (!users[post[3]]) {
        const user = await profile.connect(signer).profiles(post[3]);
        users[post[3]] = user;
      }
      posts.push(post);
    }
    setPosts(posts);
    setProfileCache(users);
  };

  const createPost = async (post) => {
    if (!isRegistered) return;
    const { body } = post;
    const signer = await provider.getSigner();
    const transaction = await blog.connect(signer).mintPost("", body, Date.now());
    await transaction.wait();
  };

  const createUser = async (user) => {
    console.log({profile});
    if (!profile || !isRegistered) return;
    const { username, imageURL } = user;
    console.log({username, imageURL});
    const signer = await provider.getSigner();
    const transaction = await profile.connect(signer).createUser(username, imageURL);
    await transaction.wait();
  };

  const signIn = async () => {
    if (!accountNFT || !profile) return;
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
    const signer = await provider.getSigner();
    setIsRegistered(await accountNFT.connect(signer).balanceOf(accounts[0]));
    const user = await profile.connect(signer).profiles(accounts[0]);
    setUsername(user[0]);
    setImageURL(user[1]);
  };

  const signOut = () => {
    setAccount(null);
    setIsRegistered(false);
    setUsername("");
    setImageURL("");
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
        profileCache,
        isRegistered,
        username,
        imageURL,
        retrieveListings,
        purchaseAccount,
        signIn,
        signOut,
        createPost,
        getPosts,
        createUser,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
