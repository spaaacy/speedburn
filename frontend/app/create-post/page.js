"use client";

import { Web3Context } from "@/context/Web3Context";
import React, { useContext, useState } from "react";

const CreatePost = () => {
  const { createPost } = useContext(Web3Context);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <div className="m-auto flex items-center justify-start md:w-[50%] h-[70%] rounded-xl relative bg-white padding">
      <form onSubmit={() => createPost({ title, body })} className="flex flex-col gap-4 h-full w-full">
        <input className="input-box" placeholder="Title" type="text" onChange={(e) => setTitle(e.target.value)} />
        <textarea
          className="input-box h-full"
          placeholder="Body"
          type="text"
          onChange={(e) => setBody(e.target.value)}
        />
        <button type="submit" className="button :w-[20%] self-end">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
