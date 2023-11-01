"use client";

import { Web3Context } from "@/context/Web3Context";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BounceLoader from "react-spinners/BounceLoader";

const NFTItem = ({ id, submitPurchase, isRegistered }) => (
  <div className="bg-white shadow-xl rounded-xl p-4 flex justify-center items-center flex-col">
    <h3 className="font-semibold text-xl">{`Account: ${id}`}</h3>
    <button onClick={() => submitPurchase(id)} disabled={isRegistered} type="button" className="action-button mt-4">
      Purchase
    </button>
  </div>
);

const Marketplace = () => {
  const { isContextInitialized, retrieveListings, purchaseNFT, listedAccounts, listAccount, isRegistered } =
    useContext(Web3Context);

  const { push: router } = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isContextInitialized) return;
    retrieveListings();
  }, [isContextInitialized]);

  const submitPurchase = async (id) => {
    setLoading(true);
    await purchaseNFT(id);
    setLoading(false);
    // TODO: Begin account creation
    // Redirect to home upon completion
    router("/");
  };

  return (
    <main className="flex-1 flex max-width w-full">
      {loading ? (
        <div className="flex-1 flex justify-center items-center">
            <BounceLoader color="#ea580c" />
        </div>
      ) : (
        <>
          <h1 className="text-3xl self-start font-bold">View SpeedBurns available for sale</h1>
          <div className="grid grid-cols-5 gap-4 mt-4">
            {listedAccounts &&
              listedAccounts.map((id) => (
                <NFTItem isRegistered={isRegistered} key={id} id={id} submitPurchase={submitPurchase} />
              ))}
          </div>
          {isRegistered && (
            <button type="button" className="action-button self-end" onClick={listAccount}>
              Sell account
            </button>
          )}
        </>
      )}
    </main>
  );
};

export default Marketplace;
