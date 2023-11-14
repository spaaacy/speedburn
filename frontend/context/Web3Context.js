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
  7: "Executed",
};


export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  // Misc
  const router = useRouter();
  const nftPrice = ethers.parseEther("5");
  const [isInitialized, setIsInitialized] = useState(false);
  const [provider, setProvider] = useState(null);

  // User
  const [account, setAccount] = useState(null);
  const [ownsSpeedburn, setOwnsSpeedburn] = useState(null);
  const [user, setUser] = useState(null);

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

      setIsInitialized(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isInitialized) {
      signIn();

    } else {
      initializeContext();
    }
  }, [isInitialized, account]); // setAccount from listener calls signIn again

  const getCurrentBlock = async () => {
    let blockNumber;
    if (!isInitialized) return blockNumber;
    try {
      blockNumber = await provider.getBlockNumber();
    } catch (error) {
      console.error(error);
    }
    return blockNumber;
  };

  const signIn = async () => {
    let success = false;
    if (!isInitialized) return success;
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      const balance = await speedburnContract.balanceOf(accounts[0]);
      const ownsSpeedburn = balance == 1
      setOwnsSpeedburn(ownsSpeedburn);

      // Fetch user from MongoDB
      const response = await fetch(`/api/users/${accounts[0]}`, {
        method: "GET",
      });
      const result = await response.json();
      if (result) {
        setUser(result);
      }
      success = true;
    } catch (error) {
      console.error(error);
    }
    return success;
  };

  const signOut = () => {
    setAccount(null);
    setOwnsSpeedburn(false);
    setUser(null);
  };

  const getTokensOwned = async (address) => {
    let tokensOwned = [];
    if (!isInitialized || address == null) return tokensOwned;
    try {
      const balance = await speedburnContract.balanceOf(address);
      for (let i = 0; i < balance; i++) {
        const tokenOwned = await speedburnContract.tokenOfOwnerByIndex(address, i);
        tokensOwned.push(tokenOwned)
      }
      return tokensOwned; // Return moved here, so if error, null is returned
    } catch (error) {
      console.error(error);
    }
  }

  const getAccountDelegate = async (address) => {
    let delegate;
    if (!isInitialized || address == null) return delegate;
    try {
      delegate = await speedburnContract.delegates(address);
      console.log(delegate);
    } catch (error) {
      console.error(error);
    }
    return delegate;
  }


  const purchaseNFT = async (id) => {
    let receipt;
    if (!isInitialized || id == null) return receipt;
    try {
      const signer = await provider.getSigner();
      const transaction = await marketplaceContract.connect(signer).purchase(id, { value: nftPrice });
      receipt = await transaction.wait();
    } catch (error) {
      console.error(error);
    }
    return receipt;
  };

  const listNFT = async () => {
    let success = false;
    if (!isInitialized) return success;
    try {
      const signer = await provider.getSigner();
      const tokenId = await speedburnContract.tokenOfOwnerByIndex(account, 0);

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
      success = true;
    } catch (error) {
      console.error(error);
    }
    return success;
  };

  const retrieveListings = async () => {
    let listings = [];
    if (!isInitialized) return listings;
    try {
      const speedburnSupply = await speedburnContract.totalSupply();
      for (let i = 0; i < speedburnSupply; i++) {
        if (await marketplaceContract.isListed(i)) {
          listings.push(i)
        }
      }
      return listings; // Return moved here, so if error, null is returned
    } catch (error) {
      console.error(error);
    }
  };

  const retrieveConstitution = async () => {
    const constitution = [];
    if (!isInitialized) return constitution;
    try {
      const totalClauses = await speedburnContract.nextAmendmentId();
      for (let i = 0; i < totalClauses; i++) {
        const clause = await speedburnContract.constitution(i);
        if (!clause[1]) continue;
        constitution.push(clause);
      }
      return constitution; // Return moved here, so if error, null is returned
    } catch (error) {
      console.error(error);
    }
  };

  const proposeAmendment = async (amendment) => {
    let receipt = false;
    if (!isInitialized || amendment == null) return receipt;
    try {
      // Create proposal
      const signer = await provider.getSigner();
      const calldata = speedburnContract.interface.encodeFunctionData("amendConstitution", [amendment]);
      const transaction = await colosseumContract
        .connect(signer)
        .propose([config.speedburn.address], [0], [calldata], amendment);
      receipt = await transaction.wait();

      // Create proposal instance in database
      const proposal = {
        proposalId: `${receipt.logs[0].args.proposalId}`,
        proposer: receipt.logs[0].args.proposer.toLowerCase(),
        voteStart: `${receipt.logs[0].args.voteStart}`,
        voteEnd: `${receipt.logs[0].args.voteEnd}`,
        description: receipt.logs[0].args.description,
      };
      await fetch("/api/colosseum/proposals/create", {
        method: "POST",
        body: JSON.stringify(proposal),
      });

    } catch (error) {
      console.error(error);
    }
    return receipt;
  };

  const retrieveProposals = async () => {
    let proposals;
    if (!isInitialized) return proposals;
    try {
      const currentBlock = await provider.getBlockNumber();
      const response = await fetch(`/api/colosseum/proposals?block_number=${currentBlock}`, {
        method: "GET",
      });
      proposals = await response.json();
    } catch (error) {
      console.error(error);
    }
    return proposals;
  };

  const getProposalState = async (proposalId) => {
    let proposalState;
    if (!isInitialized || proposalId == null) return;
    try {
      proposalState = await colosseumContract.state(proposalId);
    } catch (error) {
      console.error(error);
    }
    return proposalState;
  };

  const castVote = async (proposalId, support) => {
    let receipt = false;
    if (!isInitialized || proposalId == null || support == null) return receipt;
    try {
      const signer = await provider.getSigner();
      const transaction = await colosseumContract.connect(signer).castVote(proposalId, support);
      receipt = await transaction.wait();
    } catch (error) {
      console.error(error);
    }
    return receipt;
  };

  const getProposalVotes = async (proposalId) => {
    let votes;
    if (!isInitialized || proposalId == null) return;
    try {
      votes = await colosseumContract.proposalVotes(proposalId);
    } catch (error) {
      console.error(error);
    }
    return votes;
  };

  const setAccountDelegate = async () => {
    let receipt = false;
    if (!isInitialized || !account) return receipt;
    try {
      const signer = await provider.getSigner();
      const transaction = await speedburnContract.connect(signer).delegate(account);
      receipt = await transaction.wait()
    } catch (error) {
      console.error(error);
    }
    return receipt;
  };

  const queueProposal = async (amendment) => {
    let receipt = false
    if (!isInitialized || amendment == null) return receipt;
    try {
      const signer = await provider.getSigner()
      const calldata = speedburnContract.interface.encodeFunctionData("amendConstitution", [amendment]);
      const descriptionHash = ethers.id(amendment)
      const transaction = await colosseumContract.connect(signer).queue([config.speedburn.address], [0], [calldata], descriptionHash);
      receipt = await transaction.wait();
    } catch (error) {
      console.error(error);
    }
    return receipt
  }

  const executeProposal = async (amendment) => {
    let receipt = false
    if (!isInitialized || amendment == null) return receipt;
    try {
      const signer = await provider.getSigner()
      const calldata = speedburnContract.interface.encodeFunctionData("amendConstitution", [amendment]);
      const descriptionHash = ethers.id(amendment)
      const transaction = await colosseumContract.connect(signer).execute([config.speedburn.address], [0], [calldata], descriptionHash);
      receipt = await transaction.wait();
    } catch (error) {
      console.error(error);
    }
    return receipt
  }

  return (
    <Web3Context.Provider
      value={{
        isInitialized,
        account,
        ownsSpeedburn,
        user,
        getCurrentBlock,
        signIn,
        signOut,
        getTokensOwned,
        getAccountDelegate,
        purchaseNFT,
        listNFT,
        retrieveListings,
        retrieveConstitution,
        proposeAmendment,
        retrieveProposals,
        getProposalState,
        castVote,
        getProposalVotes,
        setAccountDelegate,
        queueProposal,
        executeProposal
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
