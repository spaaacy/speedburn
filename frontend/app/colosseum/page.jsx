"use client";

import { Web3Context } from "@/context/Web3Context";
import { useContext, useEffect } from "react";

const Colosseum = () => {
  const { isContextInitialized, retrieveProposals, proposals } = useContext(Web3Context);

  useEffect(() => {
    if (!isContextInitialized) return;
    retrieveProposals();
  }, [isContextInitialized]);

  return (
    <main className="max-width w-full">
      <div className="grid grid-cols-3 gap-4">
        {proposals &&
          proposals.map((proposal, i) => (
            <div key={i} className="bg-jet rounded-xl p-4 flex flex-col">
              <p className="text-white font-semibold truncate">{`Proposal ID: ${proposal.proposalId}`}</p>
              <p className="text-white">{proposal.description}</p>
            </div>
          ))}
      </div>
    </main>
  );
};

export default Colosseum;
