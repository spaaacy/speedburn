"use client";

import Post from "@/components/Post";
import { Web3Context } from "@/context/Web3Context";
import { useContext, useEffect } from "react";
import CreatePost from "../components/CreatePost";
import Hero from "@/components/Hero";
import Image from "next/image";

const Home = () => {
  const { isContextInitialized, posts, getPosts, isRegistered, profileCache } = useContext(Web3Context);

  useEffect(() => {
    if (!isContextInitialized) return;
    getPosts();
  }, [isContextInitialized]);

  return (
    <main className="flex-center flex-col gap-4 m-auto">
      <div className="relative w-full h-[640px]">
        <div className="-z-10">
          <Image src={"/assets/images/hero_bg.jpg"} layout="fill" />
        </div>
        <div className="flex relative justify-center items-center h-full">
          <h1 className="text-white text-3xl">Welcome to SpeedBurn</h1>
        </div>
      </div>
      {/* {!isRegistered && <Hero />} */}

      {/* {isRegistered && (
        <div className="max-width">
          <CreatePost />
          {posts.map((post, i) => (
            <Post
              key={i}
              post={{
                title: post[0],
                body: post[1],
                timestamp: post[2],
                username: profileCache[post[3]][0],
                image: profileCache[post[3]][1],
              }}
            />
          ))}
        </div>
      )} */}
    </main>
  );
};

export default Home;
