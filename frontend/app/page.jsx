"use client";

import Post from "@/components/Post";
import { Web3Context } from "@/context/Web3Context";
import { useContext, useEffect, useState } from "react";
import CreatePost from "../components/CreatePost";
import Hero from "@/components/Hero";

const Home = () => {
  const { isContextInitialized, isRegistered } = useContext(Web3Context);
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts", { method: "GET" });
      const results = await response.json();
      setPosts(results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isContextInitialized || !isRegistered) return;
    fetchPosts();
  }, [isContextInitialized, isRegistered]);

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
                title: post.title,
                body: post.body,
                timestamp: post.createdAt,
                username: post.author.username,
                image: post.author.image,
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default Home;
