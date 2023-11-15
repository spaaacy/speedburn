"use client";

import EditProfile from "@/components/EditProfile";
import { Web3Context } from "@/context/Web3Context";
import { useContext } from "react";

const Account = () => {
  const { account, user } = useContext(Web3Context);

  const handleSubmit = async (e, username, image) => {
    e.preventDefault();
    try {
      await fetch(`/api/users/${account}/edit-details`, {
        method: "PATCH",
        body: JSON.stringify({
          username,
          image,
        }),
      });
    } catch (error) {
      console.error(error);
    } finally {
      window.location.reload();
    }
  };

  return (
    <main className="w-full max-width flex justify-center">
      {user ? <EditProfile
        headerMessage={"Change account details"}
        confirmMessage={"Save changes"}
        handleSubmit={handleSubmit}
      /> :
        <h1 className="font-semibold">Sign in to view account 😷</h1>}
    </main>
  );
};

export default Account;
