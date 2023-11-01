"use client";

import EditProfile from "@/components/EditProfile";
import { Web3Context } from "@/context/Web3Context";
import { Log } from "ethers";
import { useContext, useState } from "react";

const Account = () => {
  const [usernameField, setUsernameField] = useState("");
  const [imageField, setImageField] = useState("");
  const { account, username, tokenOwned } = useContext(Web3Context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/users/create", {
      method: "POST",
      body: JSON.stringify({
        address: account,
        username: usernameField,
        image: imageField
      })
    })
    if (res.ok) console.log("User created");
  };

  return (
    <main className="m-auto max-width flex justify-start items-start flex-col">
      <h1 className="text-pale text-3xl font-bold">Your Account:</h1>
      <h3 className="mt-4 text-pale text-xl font-semibold">{`SpeedBurn ${tokenOwned} holder`}</h3>
      <EditProfile confirmMessage={"Save changes"} />
    </main>
  );
};

export default Account;
