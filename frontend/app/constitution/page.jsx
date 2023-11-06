"use client";

import { Web3Context } from "@/context/Web3Context";
import Link from "next/link";
import { useContext, useEffect } from "react";

const Constitution = () => {
  const { isContextInitialized, retrieveConstitution, constitution, isRegistered } = useContext(Web3Context);

  useEffect(() => {
    if (!isContextInitialized) return;
    const success = retrieveConstitution();
    if (!success) console.error("Retrieve constitution unsuccessful!");
  }, [isContextInitialized]);

  return (
    <main className="max-width px-28 w-full flex flex-col gap-4 justify-start items-start">
      <h1 className="text-3xl font-bold font-serif">The Constitution</h1>
      <ul className="ml-10 mt-2">
        {constitution.map((rule, i) => {
          return (
            <li key={i}>
              <p className="text-lg font-serif">{`${i + 1}: ${rule[0]}`}</p>
            </li>
          );
        })}
      </ul>
      {isRegistered && (
        <Link className="action-button-dark self-end" href="/propose-amendment">
          Propose amendment
        </Link>
      )}
    </main>
  );
};

export default Constitution;
