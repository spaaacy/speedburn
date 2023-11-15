"use client";

import { Web3Context } from "@/context/Web3Context";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const Home = () => {
  const { ownsSpeedburn } = useContext(Web3Context);
  const router = useRouter();

  useEffect(() => {
    if (ownsSpeedburn) {
      router.push("/")
    }
  }, [ownsSpeedburn]);

  return (
    <main className="flex-1 flex">
      <div className="flex-1 bg-black relative">
        <div className="opacity-70">
          <Image src="/assets/images/hero_bg.jpg" alt="hero_bg" fill={true} style={{ objectFit: "cover" }} />
        </div>
        <div className="flex flex-col max-sm:w-full max-sm:items-center max-sm:top-[20%] absolute sm:top-[22%] sm:left-[10%]">
          <h1 className="max-sm:text-3xl  sm:text-9xl max-sm:text-center sm:text-left font-bold text-blue-100 sm:mix-blend-difference">
            Welcome to
            <br />
            <span className="text-fire">SpeedBurn</span>
          </h1>
          <div className="flex max-sm:justify items-center mt-10 max-sm:mt-20 gap-6">
            <Link href="/communities" className="text-white font-bold text-lg max-sm:text-base hover:text-fire">
              Communities
            </Link>
            <Link href="/colosseum" className="text-white font-bold text-lg max-sm:text-base hover:text-fire">
              Colosseum
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
