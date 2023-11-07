"use client";

import { Web3Context } from "@/context/Web3Context";
import { calculateTimeLeft, formatAddress } from "@/util/helpers";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const ProposalDetails = () => {
  const { isContextInitialized, getCurrentBlock } = useContext(Web3Context);
  const [proposal, setProposal] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const { proposalId } = useParams();

  const fetchProposal = async () => {
    const response = await fetch(`/api/proposal/${proposalId}`, {
      method: "GET",
    });
    const proposal = await response.json();
    setProposal(proposal);
    getTimeLeft(proposal.voteEnd);
  };

  const getTimeLeft = async (voteEnd) => {
    const result = calculateTimeLeft(await getCurrentBlock(), voteEnd);
    console.log(result);
    setTimeLeft(result);
  };

  useEffect(() => {
    if (!isContextInitialized) return;
    fetchProposal();
    // TODO: Get proposal state
  }, [isContextInitialized]);

  const handleAccept = async (proposalId) => {
    await castVote(proposalId, VoteType.For);
  };
  const handleReject = async () => {
    await castVote(proposalId, VoteType.Reject);
  };
  const handleAbstain = async () => {
    await castVote(proposalId, VoteType.Abstain);
  };

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
            <div className="flex justify-between items-center">
              {timeLeft && 
              <p>
                {`Ends in: ${timeLeft.seconds} `}
                <span className="italic">{`(${timeLeft.blocks} blocks)`}</span>
              </p>
              }
              <a
              href={`/user/${proposal.proposer}`}
               className="self-end">
                {`Proposer: ${proposal.author.username} `}
                <span className="italic">{`(${formatAddress(proposal.proposer)})`}</span>
              </a>
            </div>
            <div className="flex gap-2 mt-2 self-end">
              <button
                className="w-28 action-button-dark hover:bg-red-700 hover:text-white"
                onClick={handleReject}
                type="button"
              >
                Reject
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
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default ProposalDetails;
