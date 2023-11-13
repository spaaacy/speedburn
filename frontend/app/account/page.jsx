"use client";

import EditProfile from "@/components/EditProfile";
import { Web3Context } from "@/context/Web3Context";
import { useContext, useEffect, useState } from "react";

const Account = () => {
  const [usernameField, setUsernameField] = useState("");
  const [imageField, setImageField] = useState("");
  const [delegate, setDelegate] = useState(null);
  const { isInitialized, getAccountDelegate, setAccountDelegate, account } = useContext(Web3Context);

  const handleDelegate = async () => {
    await setAccountDelegate();
    window.location.reload();
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`/api/users/${account}/edit-details`, {
        method: "PATCH",
        body: JSON.stringify({
          username: usernameField,
          image: imageField,
        }),
      });
    } catch (error) {
      console.error(error);
    } finally {
      window.location.reload();
    }
  };

  const fetchAccountDelegate = async () => {
    const delegate = await getAccountDelegate(account);
    setDelegate(delegate)
    if (!delegate) {
      console.error("Fetch account delegate unsuccessful!");
    }
  }
  
  useEffect(() => {
    if (!isInitialized || !account) return;
    fetchAccountDelegate();
  }, [isInitialized, account])
  
  // TODO: Check if user is registered; Create error component for unregistered users
  return (
    <main className="w-full max-width flex justify-center">
      <EditProfile
      account={account}
        delegate={delegate}
        setAccountDelegate={handleDelegate}
        headerMessage={"Change account details"}
        confirmMessage={"Save changes"}
        handleSubmit={handleSubmit}
        setUsernameField={setUsernameField}
        setImageField={setImageField}
      />
    </main>
  );
};

export default Account;
