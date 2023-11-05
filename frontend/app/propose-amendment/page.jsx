"use client";

import { Web3Context } from "@/context/Web3Context";
import { useContext, useEffect, useState } from "react";

const page = () => {
  const { isRegistered, proposeAmendment } = useContext(Web3Context);
  const [body, setBody] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await proposeAmendment(body);
    if (!success) {
      console.log("Handle submit unsuccessful!");
    }
  };

  return (
    <main className="max-width w-full flex flex-col gap-3 justify-start items-center flex-auto">
      {isRegistered ? (
        <>
          <h1 className="text-3xl font-bold">Propose Amendment</h1>

          <form onSubmit={(e) => handleSubmit(e)} className="flex justify-start items-center w-[75%] mt-4">
            <input
              className="p-3 rounded-lg border-jet focus:outline-none focus:border-fireorange border-2 w-full"
              type="text"
              onChange={(e) => setBody(e.target.value)}
              placeholder="Amendment"
            />
            <button className="action-button-dark ml-4" type="submit">
              Submit
            </button>
          </form>
        </>
      ) : (
        // TODO: Use unregistered component here
        <></>
      )}
    </main>
  );
};

export default page;
