"use client";

import { VoteType, Web3Context } from "@/context/Web3Context";
import { formatAddress, formatProposalid } from "@/util/helpers";
import Link from "next/link";
import { useContext, useEffect } from "react";

const Colosseum = () => {
  const { isContextInitialized, retrieveProposals, proposals, castVote } = useContext(Web3Context);

  useEffect(() => {
    if (!isContextInitialized) return;
    retrieveProposals();
  }, [isContextInitialized]);



  return (
    <main className="max-width w-full">
      <div className="grid grid-cols-2 gap-4">
        {proposals &&
          proposals.map((proposal, i) => (
            <ProposalItem
              key={i}
              proposal={proposal}
            />
          ))}
      </div>
    </main>
  );
};

const ProposalItem = ({ proposal }) => {
  return (
    <Link href={`/proposal/${proposal.proposalId}`} className="transition bg-jet hover:bg-fire rounded-xl p-4 flex flex-col shadow gap-2">
      <h3 className="self-center text-white font-semibold text-xl">{`Proposal ID: ${formatProposalid(proposal.proposalId)}`}</h3>
      <p className="text-white text-lg">{proposal.description}</p>
      <p className="text-white self-end text-sm">{proposal.author.username}<span className="italic">
        {`(${formatAddress(proposal.proposer)})`}
        </span></p>
    </Link>
  );
};

export default Colosseum;
