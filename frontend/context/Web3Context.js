"use client";

import { createContext, useEffect, useState } from "react";
import { ethers, id } from "ethers";
import config from "@/public/contracts";
import { useRouter } from "next/navigation";

export const VoteType = {
  Against: 0,
  For: 1,
  Abstain: 2,
};

export const ProposalState = {
  0: "Pending",
  1: "Active",
  2: "Canceled",
  3: "Defeated",
  4: "Succeeded",
  5: "Queued",
  6: "Expired",
  7: "Executed"
}

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  // Misc
  const router = useRouter();
  const nftPrice = ethers.parseEther("5");
  const [isContextInitialized, setIsContextInitialized] = useState(false);
  const [provider, setProvider] = useState(null);
  const [listedAccounts, setListedAccounts] = useState([]);
  const [constitution, setConstitution] = useState([]);
  const [proposals, setProposals] = useState([]);

  // User
  const [account, setAccount] = useState(null);
  const [isRegistered, setIsRegistered] = useState(null);
  const [username, setUsername] = useState(null);
  const [displayPicture, setDisplayPicture] = useState(null);
  const [tokenOwned, setTokenOwned] = useState(null);

  // Contracts
  const [marketplaceContract, setMarketplaceContract] = useState(null);
  const [speedburnContract, setSpeedBurnContract] = useState(null);
  const [colosseumContract, setColosseumContract] = useState(null);

  // TODO: Add loading start for sign in
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
      const speedburnContract = new ethers.Contract(config.speedburn.address, config.speedburn.abi, provider);
      setSpeedBurnContract(speedburnContract);
      const marketplaceContract = new ethers.Contract(config.marketplace.address, config.marketplace.abi, provider);
      setMarketplaceContract(marketplaceContract);
      const colosseumContract = new ethers.Contract(config.colosseum.address, config.colosseum.abi, provider);
      setColosseumContract(colosseumContract);


      // Account change listener
      window.ethereum.on("accountsChanged", async () => {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
        router.push("/");
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

  const getCurrentBlock = async () => {
    if (!isContextInitialized) return;
    return await provider.getBlockNumber();
  };

  const signIn = async () => {
    let success = false;
    if (!isContextInitialized) return success;
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
      success = true;

      if (!isRegistered) return success;
      const tokenOwned = await speedburnContract.tokenOfOwnerByIndex(accounts[0], 0);
      setTokenOwned(tokenOwned);
      console.log(await speedburnContract.delegates(accounts[0]));
    } catch (error) {
      console.error(error);
    }
    return success;
  };

  const signOut = () => {
    setAccount(null);
    setIsRegistered(false);
    setUsername("");
    setDisplayPicture("");
  };

  const purchaseNFT = async (id) => {
    let success = false;
    if (!isContextInitialized || !id) return success;
    const signer = await provider.getSigner();
    try {
      const transaction = await marketplaceContract.connect(signer).purchase(id, { value: nftPrice });
      await transaction.wait();
      setIsRegistered(await speedburnContract.balanceOf(account));
      const newListings = await retrieveListings();
      if (!newListings) console.error("Retrieve listings unsuccessful!");
      success = true;
    } catch (error) {
      console.error(error);
    }
    return success;
  };

  const listNFT = async () => {
    let success = false;
    if (!isContextInitialized) return success;
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
      const newListings = await retrieveListings();
      if (!newListings) console.error("Retrieve listings unsuccessful!");
      success = true;
    } catch (error) {
      console.error(error);
    }
    return success;
  };

  const retrieveListings = async () => {
    let success = false;
    if (!isContextInitialized) return success;
    try {
      setListedAccounts([]);
      const totalAccountNFTs = await speedburnContract.totalSupply();
      for (let i = 0; i < totalAccountNFTs; i++) {
        if (await marketplaceContract.isListed(i)) {
          setListedAccounts((prevAccounts) => [...prevAccounts, i]);
        }
      }
      success = true;
    } catch (error) {
      console.error(error);
    }
    return success;
  };

  const retrieveConstitution = async () => {
    let success = false;
    if (!isContextInitialized) return success;
    const constitution = [];
    try {
      const totalClauses = await speedburnContract.nextAmendmentId();
      for (let i = 0; i < totalClauses; i++) {
        const clause = await speedburnContract.constitution(i);
        if (!clause[1]) continue;
        constitution.push(clause);
      }
      setConstitution(constitution);
      success = true;
    } catch (error) {
      console.error(error);
    }
    return success;
  };

  const proposeAmendment = async (amendment) => {
    let success = false;
    if (!isContextInitialized || !amendment) return success;
    try {
      // Create proposal
      const signer = await provider.getSigner();
      const calldata = speedburnContract.interface.encodeFunctionData("amendConstitution", [amendment]);
      const transaction = await colosseumContract
        .connect(signer)
        .propose([config.speedburn.address], [0], [calldata], amendment);
      const receipt = await transaction.wait();
      console.log(`Proposal ID: ${receipt.logs[0].args.proposalId}`);
      const proposal = {
        proposalId: `${receipt.logs[0].args.proposalId}`,
        proposer: receipt.logs[0].args.proposer.toLowerCase(),
        voteStart: `${receipt.logs[0].args.voteStart}`,
        voteEnd: `${receipt.logs[0].args.voteEnd}`,
        description: receipt.logs[0].args.description,
      };
      await fetch("/api/proposal/create", {
        method: "POST",
        body: JSON.stringify(proposal),
      });
      success = true;
    } catch (error) {
      console.error(error);
    }
    return success;
  };

  const retrieveProposals = async () => {
    let success = false;
    if (!isContextInitialized) return success;
    try {
      const currentBlock = await provider.getBlockNumber();
      const response = await fetch(`/api/proposal?block_number=${currentBlock}`, {
        method: "GET",
      });
      const proposals = await response.json();
      setProposals(proposals);
      success = true;
    } catch (error) {
      console.error(error);
    }
    return success;
  };

  const getProposalState = async (proposalId) => {
    let proposalState;
    if (!isContextInitialized || !proposalId) return;
    try {
      proposalState = await colosseumContract.state(proposalId);
    } catch (error) {
      console.error(error);
    }
    return proposalState;
  };

  const castVote = async (proposalId, support) => {
    let success = false;
    if (!isContextInitialized || !proposalId || !support) return success;
    try {
      console.log({proposalId, support});
      const signer = await provider.getSigner();
      const transaction = await colosseumContract.connect(signer).castVote(proposalId, support);
      await transaction.wait();
      success = true;
    } catch (error) {
      console.error(error);
    }
    return success;
  };

  const getProposalVotes = async (proposalId) => {
    if (!isContextInitialized || !proposalId) return;
    let votes;
    try {
      votes = await colosseumContract.proposalVotes(proposalId);
    } catch (error) {
      console.error(error);
    }
    return votes;
  }

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
        constitution,
        proposals,
        getCurrentBlock,
        signIn,
        signOut,
        purchaseNFT,
        listNFT,
        retrieveListings,
        retrieveConstitution,
        proposeAmendment,
        retrieveProposals,
        getProposalState,
        castVote,
        getProposalVotes,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
