"use client";

import Post from "@/components/Post";
import { Web3Context } from "@/context/Web3Context";
import { useContext, useEffect } from "react";
import CreatePost from "../components/CreatePost";
import Hero from "@/components/Hero";
import Image from "next/image";

const Home = () => {
  const { isContextInitialized, posts, getPosts, account, isRegistered, profileCache } = useContext(Web3Context);

  useEffect(() => {
    if (!isContextInitialized) return;
    getPosts();
  }, [isContextInitialized]);

  return (
    <main className="relative flex justify-center items-center flex-col gap-4">
      
      
      {!isRegistered && <Hero />}

      {isRegistered && (
        <div className="max-width flex flex-col justify-start items-center">
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
      )}
    </main>
  );
};

export default Home;
