"use client";

import Post from "@/components/Post";
import { Web3Context } from "@/context/Web3Context";
import { useContext, useEffect } from "react";
import CreatePost from "../components/CreatePost";

const Home = () => {
  const { blog, posts, getPosts, isRegistered, profileCache } = useContext(Web3Context);

  useEffect(() => {
    if (!blog) return;
    getPosts();
  }, [blog]);

  return (
    <main className="flex-center flex-col max-w-[680px] gap-4 m-auto">
      {isRegistered && <CreatePost />}
      {console.log(profileCache)}
      {posts.map((post, i) => (
        <Post
          key={i}
          post={{
            title: post[0],
            body: post[1],
            timestamp: post[2],
            username: profileCache[post[3]][0],
            image: profileCache[post[3]][1]
          }}
        />
      ))}
    </main>
  );
};

export default Home;
