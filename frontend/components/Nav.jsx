"use client";

import formatAddress from "@/util/formatAddress";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { Web3Context } from "@/context/Web3Context";

const NavAccount = ({ menuRef, account, signOut, showDropdown, setShowDropdown }) => {
  return (
    <div className="relative flex justify-end items-center gap-3">
      <p className="font-semibold italic text-white">{formatAddress(account)}</p>
      <Image
        src={"assets/icons/account.svg"}
        onClick={() => setShowDropdown(!showDropdown)}
        className="hover:cursor-pointer filter-white"
        alt="user_image"
        width={45}
        height={45}
      />
      <div
        ref={menuRef}
        className={`absolute top-14 bg-white shadow-xl rounded-xl p-4 ${showDropdown ? "block" : "hidden"}`}
      >
        <ul className="flex flex-col justify-center items-end gap-1">
          <li>
            <a href="/account" className="font-semibold overflow-hidden whitespace-nowrap">
              Account
            </a>
          </li>
          <hr className="w-full" />
          <li>
            <button type="button" className="font-semibold overflow-hidden whitespace-nowrap" onClick={() => signOut()}>
              Sign Out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

const Nav = () => {
  const { signIn, signOut, account } = useContext(Web3Context);
  const [showDropdown, setShowDropdown] = useState(false);
  let dropdownRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <nav className="bg-jet sticky top-0 flex-center padding max-width">
      <div className="flex flex-1 justify-start items-center gap-6">
        <Link href="/">
          <h1 className="font-bold text-3xl mr-4 text-white">
            Project <span className="italic">SpeedBurn</span>
          </h1>
        </Link>
        <Link href="/create-post" className="font-bold text-xl text-white">
          Create post
        </Link>
        <Link href="/marketplace" className="font-bold text-xl text-white">
          Marketplace
        </Link>
      </div>
      {account ? (
        <NavAccount
          menuRef={dropdownRef}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          account={account}
          signOut={signOut}
        />
      ) : (
        <button className="action-button" type="button" onClick={() => signIn()}>
          Sign In
        </button>
      )}
    </nav>
  );
};

export default Nav;
