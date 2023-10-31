"use client";

import { createContext, useEffect, useState } from "react";
import config from "@/public/config.json";
import accountArtifact from "@/public/abi/Account.json";
import marketplaceArtifact from "@/public/abi/Marketplace.json";
import blogArtifact from "@/public/abi/Blog.json";
import profileArtifact from "@/public/abi/Profile.json";
import { ethers } from "ethers";

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  // Contract ABIs
  const { abi: accountAbi } = accountArtifact;
  const { abi: marketplaceAbi } = marketplaceArtifact;
  const { abi: blogAbi } = blogArtifact;
  const { abi: profileAbi } = profileArtifact;

  // Misc
  const [isContextInitialized, setIsContextInitialized] = useState(false);
  const [provider, setProvider] = useState(null);
  const [posts, setPosts] = useState([]);
  const [profileCache, setProfileCache] = useState({});
  const [listedAccounts, setListedAccounts] = useState([]);

  // User
  const [account, setAccount] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [username, setUsername] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  // Contracts
  const [marketplaceContract, setMarketplaceContract] = useState(null);
  const [accountContract, setAccountContract] = useState(null);
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
      const accountNFT = new ethers.Contract(config.account.address, accountAbi, provider);
      setAccountContract(accountNFT);
      const marketplace = new ethers.Contract(config.marketplace.address, marketplaceAbi, provider);
      setMarketplaceContract(marketplace);
      const blog = new ethers.Contract(config.blog.address, blogAbi, provider);
      setBlogContract(blog);
      const profile = new ethers.Contract(config.profile.address, profileAbi, provider);
      setProfileContract(profile);

      setIsContextInitialized(true);
    };

    if (isContextInitialized) {
      signIn();
    } else {
      initializeContext();
    }

  }, [isContextInitialized]);

  const purchaseAccount = async (id) => {
    if (!accountContract || !account) return;
    const signer = await provider.getSigner();
    const transaction = await marketplaceContract.connect(signer).purchase(id, { value: 2 });
    await transaction.wait();
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

  const createPost = async (post) => {
    if (!isRegistered) return;
    const { body } = post;
    const signer = await provider.getSigner();
    const transaction = await blogContract.connect(signer).mintPost("", body, Date.now());
    await transaction.wait();
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
    setIsRegistered(await accountContract.balanceOf(accounts[0]));
    const user = await profileContract.profiles(accounts[0]);
    setUsername(user[0]);
    setImageURL(user[1]);
  };

  const signOut = () => {
    setAccount(null);
    setIsRegistered(false);
    setUsername("");
    setImageURL("");
  };

  const retrieveListings = async () => {
    if (!marketplaceContract || !accountContract) return;
    setListedAccounts([]);
    const totalAccountNFTs = await accountContract.nextTokenId();
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
        posts,
        profileCache,
        isRegistered,
        username,
        imageURL,
        listedAccounts,
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
