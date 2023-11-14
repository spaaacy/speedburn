"use client";

import { Web3Context } from "@/context/Web3Context";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const ProposeAmendment = () => {
  const router = useRouter();
  const { ownsSpeedburn, proposeAmendment } = useContext(Web3Context);
  const [body, setBody] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const receipt = await proposeAmendment(body);
    if (receipt == null) console.log("Handle submit unsuccessful!");
    router.push("/colosseum")
  };

  return (
    <main className="max-width w-full flex flex-col gap-3 justify-start items-center flex-auto">
      {ownsSpeedburn ? (
        <>
          <h1 className="text-3xl font-bold">Propose Amendment</h1>

          <form onSubmit={(e) => handleSubmit(e)} className="flex justify-start items-center w-[75%] mt-4">
            <input
              className="p-3 rounded-lg border-jet focus:outline-none focus:border-fire border-2 w-full"
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

export default ProposeAmendment;
