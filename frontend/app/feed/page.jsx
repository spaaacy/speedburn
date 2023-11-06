'use client'

import CreatePost from "@/components/CreatePost";
import Post from "@/components/Post";
import { Web3Context } from "@/context/Web3Context";
import { useContext, useEffect, useState } from "react";

const Feed = () => {
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
    <main className="max-width flex-auto flex flex-col justify-start items-center gap-4 ">
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
    </main>
  );
};

export default Feed;