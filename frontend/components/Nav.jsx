"use client";

import formatAddress from "@/util/formatAddress";
import signIn from "@/util/signIn";
import { ethers } from "ethers";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Web3Context } from "@/context/Web3Context";

const Nav = () => {
  const { provider, setProvider, account, setAccount, initializeContracts } = useContext(Web3Context);

  useEffect(() => {
    if (window.ethereum == null) {
      setProvider(new ethers.getDefaultProvider());
    } else {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    }

    initializeContracts();

    window.ethereum.on("accountsChanged", async () => {
      signIn(setAccount);
    });
  }, []);

  return (
    <nav className="sticky top-0 flex justify-between items-center padding max-width">
      <div className="flex justify-center items-center gap-4">
        <Link href="/">
          <h1 className="font-bold text-3xl">
            Project <span className="italic">SpeedBurn</span>
          </h1>
        </Link>
        <Link href="/marketplace">Marketplace</Link>
      </div>
      {account ? (
        <div className="flex-center gap-4">
          <button type="button" className="nav_button" onClick={() => setAccount(null)}>
            Sign Out
          </button>
          <p className="text-black font-semibold italic">{formatAddress(account)}</p>
          <Image src={"assets/icons/account.svg"} alt="user_image" width={45} height={45} />
        </div>
      ) : (
        <button className="nav_button" type="button" onClick={() => signIn(setAccount)}>
          Sign In
        </button>
      )}
    </nav>
  );
};

export default Nav;
