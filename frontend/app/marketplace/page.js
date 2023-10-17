"use client";

import { Web3Context } from "@/context/Web3Context";
import { useContext, useEffect, useState } from "react";

const AccountItem = ({ id, purchaseAccount }) => (
  <div className="bg-white shadow-xl rounded-xl p-4 flex-center flex-col">
    <h3 className="font-semibold text-xl">{`Account: ${id}`}</h3>
    <button onClick={() => purchaseAccount(id)} type="button" className="bg-slate-700 rounded-md p-2 text-white mt-4">
      Purchase
    </button>
  </div>
);

const Marketplace = () => {
  const { marketplace, accountNFT, retrieveListings, purchaseAccount } = useContext(Web3Context);

  const [listedIds, setListedIds] = useState([]);

  useEffect(() => {
    retrieveListings((i) => setListedIds((prevIds) => [...prevIds, i]));
  }, [marketplace, accountNFT]);

  return (
    <main className="flex-center flex-col max-width">
      <div className="grid grid-cols-5 gap-4">
        {listedIds && listedIds.map((id) => <AccountItem key={id} id={id} purchaseAccount={purchaseAccount} />)}
      </div>
    </main>
  );
};

export default Marketplace;
