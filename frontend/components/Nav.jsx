"use client";

import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { Web3Context } from "@/context/Web3Context";
import UserImage from "./UserImage";

const Nav = () => {
  const { signIn, signOut, account, username, displayPicture, isRegistered } = useContext(Web3Context);
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
    <nav className="sticky top-0 z-10 bg-white">
      <div className="flex justify-center items-center py-6 max-width">
        <div className="flex flex-1 justify-start items-end gap-6">
          <Link href="/">
            <h1 className="text-orange-600 font-bold text-3xl mr-4">SpeedBurn</h1>
          </Link>
          <Link href="/marketplace" className="font-bold text-xl text-black">
            Marketplace
          </Link>
        </div>
        {account ? (
          isRegistered ? (
            <NavAccount
              menuRef={dropdownRef}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              signOut={signOut}
              username={username}
              displayPicture={displayPicture}
            />
          ) : (
            <a href="marketplace" className="action-button">Purchase pass to begin</a>
          )
        ) : (
          <button className="action-button" type="button" onClick={() => signIn()}>
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

const NavAccount = ({ menuRef, signOut, showDropdown, setShowDropdown, username, displayPicture }) => {
  return (
    <div className="relative flex justify-end items-center gap-3">
      <p className="font-semibold text-black">{username}</p>
      <UserImage onClick={() => setShowDropdown(!showDropdown)} displayPicture={displayPicture} />
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

export default Nav;
