"use client";

import { Web3Context } from "@/context/Web3Context";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const Home = () => {
  const { isRegistered, account } = useContext(Web3Context);
  const router = useRouter();

  useEffect(() => {
    if (isRegistered) {
      router.push("/feed")
    }
  }, [isRegistered]);

  return (
    <main className="flex-1 flex">
      <div className="flex-1 bg-black relative">
      <div className="opacity-80">
        <Image src="/assets/images/hero_bg.jpg" alt="hero_bg" fill={true} />
      </div>
      <div className="flex flex-col absolute top-56 left-20">
        <h1 className="text-9xl text-left font-bold text-blue-100 mix-blend-difference">
          Welcome to
          <br />
          <span className="text-fireorange">SpeedBurn</span>
        </h1>
        <div className="flex items-center mt-10 gap-6">
          <Link href="/marketplace" className="text-white font-bold text-lg hover:text-fireorange">
            Marketplace
          </Link>
          <Link href="/colosseum" className="text-white font-bold text-lg hover:text-fireorange">
            Colosseum
          </Link>
          <Link href="/constitution" className="text-white font-bold text-lg hover:text-fireorange">
            Constitution
          </Link>
          {
            account && !isRegistered &&
            <Link href="marketplace" className="action-button ml-auto hover:bg-fireorange hover:text-white">
            Purchase pass to begin
          </Link>
          }
        </div>
      </div>
    </div>
    </main>
  );
};

export default Home;
