"use client";

import { VoteType, Web3Context } from "@/context/Web3Context";
import { formatAddress, formatProposalid } from "@/util/helpers";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

const Colosseum = () => {
  const [activeProposals, setActiveProposals] = useState([]);
  const [pastProposals, setPastProposals] = useState([]);
  const { isContextInitialized, retrieveProposals } = useContext(Web3Context);


  const fetchProposals = async () => {
    const proposals = await retrieveProposals();
    setActiveProposals(proposals.activeProposals); 
    setPastProposals(proposals.pastProposals); 
  }

  useEffect(() => {
    if (!isContextInitialized) return;
    fetchProposals();
  }, [isContextInitialized]);



  return (
    <main className="max-width w-full flex flex-col gap-4">
      <h1 className="font-bold text-fire text-3xl">Active Proposals</h1>
      <div className="grid grid-cols-2 gap-4">
        {activeProposals &&
          activeProposals.map((proposal, i) => (
            <ProposalItem
              key={i}
              proposal={proposal}
            />
          ))}
      </div>
      <h2 className="font-bold text-fire text-3xl">Previous Proposals</h2>
      <div className="grid grid-cols-2 gap-4">
        {pastProposals &&
          pastProposals.map((proposal, i) => (
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
