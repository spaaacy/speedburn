"use client";

import formatAddress from "@/util/formatAddress";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { Web3Context } from "@/context/Web3Context";

const Nav = () => {
  const { signIn, signOut, account } = useContext(Web3Context);

  return (
    <nav className="bg-jet sticky top-0 flex-center padding max-width">
      <div className="flex flex-1 justify-start items-baseline gap-6">
        <Link href="/">
          <h1 className="font-bold text-3xl mr-4 text-white">
            Project <span className="italic">SpeedBurn</span>
          </h1>
        </Link>
        {/* TODO: Hide create post when in create-post page */}
        {account && (
        <Link href="/create-post" className="font-bold text-xl text-white">
          Create post
        </Link>
        )}
        <Link href="/marketplace" className="font-bold text-xl text-white">
          Marketplace
        </Link>
      </div>
      {account ? (
        <div className="flex-center gap-3">
          <button type="button" className="action-button" onClick={() => signOut()}>
            Sign Out
          </button>
          <p className="font-semibold italic text-white">{formatAddress(account)}</p>
          <Image src={"assets/icons/account.svg"} className="filter-white" alt="user_image" width={45} height={45} />
        </div>
      ) : (
        <button className="action-button" type="button" onClick={() => signIn()}>
          Sign In
        </button>
      )}
    </nav>
  );
};

export default Nav;
