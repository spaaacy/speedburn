"use client";

import { Web3Context } from "@/context/Web3Context";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EditProfile from "@/components/EditProfile";
import Loader from "@/components/Loader";

const Marketplace = () => {
  const {
    account,
    isInitialized,
    retrieveListings,
    purchaseNFT,
    listNFT,
    ownsSpeedburn,
    getAccountDelegate,
    setAccountDelegate,
  } = useContext(Web3Context);

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([])
  const [currentState, setCurrentState] = useState(MarketplaceState.Purchase);
  const [usernameField, setUsernameField] = useState("");
  const [imageField, setImageField] = useState("");
  const [delegate, setDelegate] = useState(null)

  useEffect(() => {
    if (!isInitialized) return;
    fetchListings()
    fetchAccountDelegate();
  }, [isInitialized]);

  const fetchListings = async () => {
    const listings = await retrieveListings();
    setListings(listings)
    if (listings == null) console.error("Fetch listings unsuccessful");
  }

  const fetchAccountDelegate = async () => {
    const delegate = await getAccountDelegate();
    setDelegate(delegate)
    if (delegate == null) console.error("Fetch account delegate unsuccessful!");
  }

  const submitPurchase = async (id) => {
    setLoading(true);
    const receipt = await purchaseNFT(id);
    if (receipt != null) {
      try {
        // Check if account exists
        const response = await fetch(`/api/users/${account}`, {
          method: "GET",
        });

        if (!(await response.json())) {
          setCurrentState(MarketplaceState.Details);
        } else {
          router.push("/colosseum");
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Submit purchase unsuccessful!");
      setLoading(false);
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

  const submitDetails = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/users/create", {
        method: "POST",
        body: JSON.stringify({
          address: account,
          username: usernameField,
          image: imageField,
        }),
      });
      router.push("/colosseum");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex max-width w-full">
      {loading ? (
        <Loader />
      ) : (
        <div className="flex-auto flex-col flex justify-start items-center">
          {currentState === MarketplaceState.Purchase ? (
            <>
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
            </>
          ) : currentState === MarketplaceState.Details ? (
            <EditProfile
              account={account}
              setAccountDelegate={setAccountDelegate}
              delegate={delegate}
              headerMessage={"Setup your account"}
              setImageField={setImageField}
              setUsernameField={setUsernameField}
              confirmMessage="Confirm"
              handleSubmit={submitDetails}
            />
          ) : (
            <></>
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
      className="action-button bg-pale hover:text-jet mt-4 border-0"
    >
      Purchase
    </button>
  </div>
);

const MarketplaceState = {
  Purchase: 0,
  Details: 1,
};

export default Marketplace;
