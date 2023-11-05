"use client";

import { Web3Context } from "@/context/Web3Context";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BounceLoader from "react-spinners/BounceLoader";
import EditProfile from "@/components/EditProfile";

const Marketplace = () => {
  const { account, isContextInitialized, retrieveListings, purchaseNFT, listedAccounts, listNFT, isRegistered } =
    useContext(Web3Context);

  const { push: router } = useRouter();

  const [loading, setLoading] = useState(false);
  const [currentState, setCurrentState] = useState(MarketplaceState.Purchase);
  const [usernameField, setUsernameField] = useState("");
  const [imageField, setImageField] = useState("");

  useEffect(() => {
    if (!isContextInitialized) return;
    const success = retrieveListings();
    if (!success) console.error("Retrieve listings unsuccessful!");
  }, [isContextInitialized]);

  const submitPurchase = async (id) => {
    setLoading(true);
    const success = await purchaseNFT(id);
    if (success) {
      try {
        // Check if account exists
        const response = await fetch(`/api/users/${account}`, {
          method: "GET",
        });

        if (!(await response.json())) {
          setCurrentState(MarketplaceState.Details);
        } else {
          router("/");
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
      window.location.reload();
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
      router("/");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <main className="flex-auto flex max-width w-full">
      {loading ? (
        <div className="flex-auto flex justify-center items-center">
          <BounceLoader color={"#FF4500"} />
        </div>
      ) : (
        <div className="flex-auto flex-col flex justify-start items-center">
          {currentState === MarketplaceState.Purchase ? (
            <>
              <h1 className="text-3xl self-start font-bold">View SpeedBurns available for sale</h1>
              <div className="grid grid-cols-6 gap-4 mt-4">
                {listedAccounts &&
                  listedAccounts.map((id) => (
                    <NFTItem isRegistered={isRegistered} key={id} id={id} submitPurchase={submitPurchase} />
                  ))}
              </div>
              {isRegistered && (
                <button type="button" className="action-button-dark self-end" onClick={submitSell}>
                  Sell account
                </button>
              )}
            </>
          ) : currentState === MarketplaceState.Details ? (
            <EditProfile
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
  <div className="bg-fireorange shadow-xl rounded-xl p-4 flex justify-center items-center flex-col">
    <h3 className="font-semibold text-xl text-white">{`Account: ${id}`}</h3>
    <button
      onClick={() => submitPurchase(id)}
      disabled={isRegistered}
      type="button"
      className="action-button mt-4 border-0"
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
