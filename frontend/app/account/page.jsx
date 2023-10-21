"use client";

import { Web3Context } from "@/context/Web3Context";
import { useContext, useState } from "react";

const Account = () => {
  const [username, setUsername] = useState("");
  const { createUser } = useContext(Web3Context);

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser({username: username})
  }

  return (
    <main className="m-auto max-width flex justify-start items-start flex-col">
      <h1 className="text-pale text-3xl font-bold">Your Account:</h1>
      <form onSubmit={(e) => handleSubmit(e)} className="self-center flex justify-center items-start flex-col mt-6 w-[760px]">
        <div className="flex-center font-semibold gap-4">
          <label className="text-pale">Username:</label>
          <input
            placeholder="Username"
            className="border rounded-lg p-2 border-slate-400"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button className="action-button self-end" type="submit">Save changes</button>
      </form>
    </main>
  );
};

export default Account;
