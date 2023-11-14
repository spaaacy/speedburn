"use client";

import { ProposalState, VoteType, Web3Context } from "@/context/Web3Context";
import { calculateTimeLeft, formatAddress } from "@/util/helpers";
import { useParams, useRouter } from "next/navigation";

import { useContext, useEffect, useState } from "react";

const ProposalDetails = () => {
  const router = useRouter();
  const { isInitialized, getCurrentBlock, getProposalState, castVote, getProposalVotes, queueProposal, executeProposal } =
    useContext(Web3Context);
  const [proposal, setProposal] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [proposalState, setProposalState] = useState(null);
  const [proposalVotes, setProposalVotes] = useState(null);
  const { proposalId } = useParams();

  const fetchProposal = async () => {
    // Fetch proposal metadata
    const response = await fetch(`/api/colosseum/proposals/${proposalId}`, {
      method: "GET",
    });
    const proposal = await response.json();
    setProposal(proposal);
    const timeLeft = calculateTimeLeft(await getCurrentBlock(), proposal.voteEnd);
    setTimeLeft(timeLeft);
    
    // Fetch state
    const proposalState = await getProposalState(proposal.proposalId);
    if (proposalState == null) {
      console.error("Get proposal state unsuccessful");
    } else {
      setProposalState(parseInt(proposalState));
    }

    // Fetch votes
    const proposalVotes = await getProposalVotes(proposal.proposalId);
    if (proposalId == null) {
      console.error("Get proposal votes unsuccessful!");
    } else {
      setProposalVotes(proposalVotes);
    }
  };

  useEffect(() => {
    if (!isInitialized) return;
    fetchProposal();
  }, [isInitialized]);

  const handleAccept = async () => {
    const receipt = await castVote(proposal.proposalId, VoteType.For);
    window.location.reload();
    if (receipt == null) console.error("Handle accept unsuccessful!");
  };

  const handleAgainst = async () => {
    const receipt = await castVote(proposal.proposalId, VoteType.Against);
    window.location.reload();
    if (receipt == null) console.error("Handle against unsuccessful!");
  };

  const handleAbstain = async () => {
    const receipt = await castVote(proposal.proposalId, VoteType.Abstain);
    window.location.reload();
    if (receipt == null) console.error("Handle abstain unsuccessful!");
  };

  const handleQueue = async () => {
    const receipt = await queueProposal(proposal.description);
    window.location.reload();
    if (receipt == null) console.error("Handle queue unsuccessful!");
   }

   const handleExecute = async () => {
    const receipt = await executeProposal(proposal.description);
    router.push("/colosseum")
    if (receipt == null) console.error("Handle execute unsuccessful!");
   }

  return (
    <main className="max-width w-full">
      <div className="flex flex-col">
        {proposal && (
          <>
            <h1 className="text-xl">
              <span className="font-bold">{`Proposal ID: `}</span>
              {`${proposal.proposalId}`}
            </h1>

            <p className="text-lg">
              <span className="font-bold">{`Description: `}</span>
              {`${proposal.description}`}
            </p>
            <div className="flex items-center gap-3">
              {proposalState != null && (
                <p className={"font-bold"}>
                  {`State: `}
                  <span className={`${proposalState === 1 ? "text-green-600" : "text-black"}`}>
                    {`${ProposalState[proposalState].toUpperCase()}`}
                  </span>
                </p>
              )}
              {timeLeft && timeLeft.blocks >= 0 && (

                <p>
                  {`Ends in: ${timeLeft.seconds} seconds`}
                  <span className="italic">{` (${timeLeft.blocks} blocks)`}</span>
                </p>
              )}
              <a href={`/user/${proposal.proposer}`} className="ml-auto">
                {`Proposer: ${proposal.author.username} `}
                <span className="italic">{`(${formatAddress(proposal.proposer)})`}</span>
              </a>
            </div>
            <div className="flex justify-between mt-2">
              {proposalVotes && (
                <div className="flex gap-2 items-center">
                  <p><span className="font-bold text-red-700">{`Against: `}</span>{`${proposalVotes[0]}`}</p>
                  <p><span className="font-bold text-yellow-500">{`Abstain: `}</span>{`${proposalVotes[2]}`}</p>
                  <p><span className="font-bold text-green-600">{`For: `}</span>{`${proposalVotes[1]}`}</p>
                </div>
              )}
              <div className="flex items-center gap-2">

                {/* TODO: Check if address already voted */}
                {
                  proposalState === 1 &&
                  <>

                    <button
                      className="w-28 action-button-dark hover:bg-red-700 hover:text-white"
                      onClick={handleAgainst}
                      type="button"
                    >
                      Against
                    </button>
                    <button
                      className="w-28 action-button-dark hover:bg-yellow-500 hover:text-white"
                      onClick={handleAbstain}
                      type="button"
                    >
                      Abstain
                    </button>
                    <button
                      className="w-28 action-button-dark hover:bg-green-600 hover:text-white"
                      onClick={handleAccept}
                      type="button"
                    >
                      Accept
                    </button>
                  </>
                }
                {proposalState === 4 &&
                  <button
                    className="w-28 action-button-dark hover:bg-fire hover:text-white"
                    onClick={handleQueue}
                    type="button"
                  >
                    Queue

                  </button>}
                {proposalState === 5 &&
                  <button
                    className="w-28 action-button-dark hover:bg-fire hover:text-white"
                    onClick={handleExecute}
                    type="button"
                  >
                    Execute

                  </button>}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default ProposalDetails;
