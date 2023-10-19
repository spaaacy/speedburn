"use client";

import Post from "@/components/Post";
import { Web3Context } from "@/context/Web3Context";
import { useContext, useEffect } from "react";

const Home = () => {
  const { blog, posts, getPosts } = useContext(Web3Context);

  useEffect(() => {
    if (!blog) return;
    getPosts();
  }, [blog]);

  return (
    <main className="flex-center flex-col max-width">
      {posts.map((post, i) => (
        <Post
          key={i}
          post={{
            title: post[0],
            body: post[1],
            timestamp: post[2],
            author: post[3],
          }}
        />
      ))}
    </main>
  );
};

export default Home;
