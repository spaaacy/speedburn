"use client";

import { Web3Context } from "@/context/Web3Context";
import { useContext, useEffect } from "react";

const AccountItem = ({ id, submitPurchase }) => (
  <div className="bg-white shadow-xl rounded-xl p-4 flex-center flex-col">
    <h3 className="font-semibold text-xl">{`Account: ${id}`}</h3>
    <button onClick={() => submitPurchase(id)} type="button" className="action-button mt-4">
      Purchase
    </button>
  </div>
);


const Marketplace = () => {
  const { isContextInitialized, retrieveListings, purchaseAccount, listedAccounts } = useContext(Web3Context);

  const submitPurchase = async (id) => {
    await purchaseAccount(id);
    window.location.reload();
  }

  
  useEffect(() => {
    if (!isContextInitialized) return;
    retrieveListings();
  }, [isContextInitialized]);
  
  return (
    <main className="flex-center flex-col max-width">
      <div className="grid grid-cols-5 gap-4">
        {listedAccounts && listedAccounts.map((id) => <AccountItem key={id} id={id} submitPurchase={submitPurchase} />)}
      </div>
    </main>
  );
};

export default Marketplace;