"use client";

import { Web3Context } from "@/context/Web3Context";
import React, { useContext, useState } from "react";

const CreatePost = () => {
  const { createPost, isRegistered, account } = useContext(Web3Context);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ title, body });
  };

  return (
    <main className="m-auto flex items-center justify-start md:w-[50%] h-[70%] rounded-xl relative bg-white padding">
      {/* {account ? ( */}
      {true ? (
        // isRegistered ? (
        true ? (
          <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-4 h-full w-full">
            {/* <input className="border rounded-md p-3 border-slate-400" placeholder="Title" type="text" onChange={(e) => setTitle(e.target.value)} /> */}
            <textarea
              className="input-box h-full p-3"
              placeholder="What's on your mind?"
              type="text"
              onChange={(e) => setBody(e.target.value)}
            />
            <button onSubmit={(e) => handleSubmit(e)} type="submit" className="action-button-dark w-[20%] self-end">
              Post
            </button>
          </form>
        ) : (
          <p>You must own an account NFT to make posts</p>
        )
      ) : (
        <p>Please login to make posts</p>
      )}
    </main>
  );
};

export default CreatePost;
