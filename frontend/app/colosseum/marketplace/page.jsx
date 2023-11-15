"use client";

import { Web3Context } from "@/context/Web3Context";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

const Marketplace = () => {
  const {
    isInitialized,
    retrieveListings,
    purchaseNFT,
    listNFT,
    ownsSpeedburn,
  } = useContext(Web3Context);

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([])

  useEffect(() => {
    if (!isInitialized) return;
    fetchListings()
  }, [isInitialized]);

  const fetchListings = async () => {
    const listings = await retrieveListings();
    setListings(listings)
    if (listings == null) console.error("Fetch listings unsuccessful");
  }

  const submitPurchase = async (id) => {
    setLoading(true);
    const receipt = await purchaseNFT(id);
    if (receipt == null) {
      console.error("Submit purchase unsuccessful!");
      setLoading(false);
    } else {
      router.push('/colosseum')
    }
  };

  const submitSell = async () => {
    setLoading(true);
    const success = await listNFT();
    if (success) {
      router.push("/colosseum");
    } else {
      console.error("Submit sell unsuccessful!");
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex max-width w-full">
      {loading ? (
        <Loader />
      ) : (
        <div className="flex-auto flex-col flex justify-start items-center">
          <h1 className="text-3xl self-start font-bold">View SpeedBurns available for sale</h1>
          <div className="grid grid-cols-6 gap-4 mt-4">
            {listings &&
              listings.map((id) => (
                <NFTItem isRegistered={ownsSpeedburn} key={id} id={id} submitPurchase={submitPurchase} />
              ))}
          </div>
          {ownsSpeedburn && (
            <button type="button" className="action-button-dark self-end" onClick={submitSell}>
              Sell account
            </button>
          )}
        </div>
      )}
    </main>
  );
};

const NFTItem = ({ id, submitPurchase, isRegistered }) => (
  <div className="transition bg-fire hover:bg-firedark shadow-xl rounded-xl p-4 flex justify-center items-center flex-col">
    <h3 className="font-semibold text-xl text-white">{`Account: ${id}`}</h3>
    <button
      onClick={() => submitPurchase(id)}
      disabled={isRegistered}
      type="button"
      className="action-button  bg-pale mt-4 border-0"
    >
      Purchase
    </button>
  </div>
);

export default Marketplace;
