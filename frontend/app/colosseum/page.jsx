"use client";

import { Web3Context } from "@/context/Web3Context";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

const Constitution = () => {
  const { isInitialized, retrieveConstitution } = useContext(Web3Context);
  const [constitution, setConstitution] = useState([]);

  useEffect(() => {
    if (!isInitialized) return;
    fetchConstitution();
  }, [isInitialized]);

  const fetchConstitution = async () => {
    const constitution = await retrieveConstitution();
    console.log(constitution);
    setConstitution(constitution)
    if (constitution == null) console.error("Retrieve constitution unsuccessful!");
  }

  return (
    <main className="max-width px-28 w-full flex flex-col gap-4">
      <div className="bg-jet flex-1 px-4 py-6 rounded-xl shadow-xl">
        <Link className="bg-pale rounded-md px-4 py-3 font-semibold text-jet hover:text-fire" href="/colosseum/proposals">View Proposals</Link>
        <Link className="bg-pale rounded-md px-4 py-3 font-semibold text-jet hover:text-fire ml-4" href="/colosseum/marketplace">Marketplace</Link>
        <Link className="bg-pale rounded-md px-4 py-3 font-semibold text-jet hover:text-fire ml-4" href="/colosseum/propose-amendment">Propose Amendment</Link>
      </div>
      <div className="bg-jet flex-1 px-6 py-6 rounded-xl shadow-xl text-white">
        <h1 className="text-3xl font-bold font-serif">The Constitution</h1>
        <ul className="ml-10 mt-2">
          {constitution && constitution.map((rule, i) => {
            return (
              <li key={i}>
                <p className="text-lg font-serif">{`${i + 1}: ${rule[0]}`}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
};

export default Constitution;
