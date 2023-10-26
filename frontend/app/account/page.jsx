"use client";

import { Web3Context } from "@/context/Web3Context";
import { useContext, useState } from "react";

const Account = () => {
  const [usernameField, setUsernameField] = useState("");
  const [imageURLField, setImageURLField] = useState("");
  const { createUser, username } = useContext(Web3Context);

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser({ username: usernameField, imageURL: imageURLField });
  };

  return (
    <main className="m-auto max-width flex justify-start items-start flex-col">
      <h1 className="text-pale text-3xl font-bold">Your Account:</h1>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="self-center flex justify-center items-start flex-col mt-6 w-[760px]"
      >
        <div className="flex justify-center items-start flex-col font-semibold gap-4">
          <div>
            <label className="text-pale w-28 inline-block">Username:</label>
            <input
              placeholder={`${username ?? "Username"}`}
              className="border rounded-lg p-2 border-slate-400"
              onChange={(e) => setUsernameField(e.target.value)}
            />
          </div>
          <div>
            <label className="text-pale w-28 inline-block">Image URL:</label>
            <input
              placeholder="URL"
              className="border rounded-lg p-2 border-slate-400"
              onChange={(e) => setImageURLField(e.target.value)}
            />
          </div>
        </div>
        <button className="action-button self-end" type="submit">
          Save changes
        </button>
      </form>
    </main>
  );
};

export default Account;
