"use client";

import EditProfile from "@/components/EditProfile";
import { Web3Context } from "@/context/Web3Context";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const Account = () => {
  const router = useRouter();
  const [usernameField, setUsernameField] = useState("");
  const [imageField, setImageField] = useState("");
  const { isContextInitialized, delegate, setAccountDelegate, account } = useContext(Web3Context);

  const handleDelegate = async () => {
    await setAccountDelegate();
    router.refresh();
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
      router.refresh();
    }
  };

  // TODO: Check if user is registered; Create error component for unregistered users
  return (
    <main className="w-full max-width flex justify-start items-center flex-col">
      <EditProfile
      account={account}
        delegate={delegate}
        setAccountDelegate={setAccountDelegate}
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
