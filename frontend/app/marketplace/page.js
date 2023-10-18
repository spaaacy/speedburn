"use client";

import { Web3Context } from "@/context/Web3Context";
import { useContext, useEffect, useState } from "react";

const AccountItem = ({ id, submitPurchase }) => (
  <div className="bg-white shadow-xl rounded-xl p-4 flex-center flex-col">
    <h3 className="font-semibold text-xl">{`Account: ${id}`}</h3>
    <button onClick={() => submitPurchase(id)} type="button" className="action-button mt-4">
      Purchase
    </button>
  </div>
);


const Marketplace = () => {
  const { marketplace, accountNFT, retrieveListings, purchaseAccount } = useContext(Web3Context);

  const [listedIds, setListedIds] = useState([]);

  const submitPurchase = async (id) => {
    await purchaseAccount(id);
    setListedIds([]);
    window.location.reload();
  }

  
  useEffect(() => {
    retrieveListings((i) => setListedIds((prevIds) => [...prevIds, i]));
  }, [marketplace, accountNFT]);

  return (
    <main className="flex-center flex-col max-width">
      <div className="grid grid-cols-5 gap-4">
        {listedIds && listedIds.map((id) => <AccountItem key={id} id={id} submitPurchase={submitPurchase} />)}
      </div>
    </main>
  );
};

export default Marketplace;
