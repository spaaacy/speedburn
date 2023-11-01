import { Web3Context } from "@/context/Web3Context";
import { useContext, useState } from "react";

const CreatePost = () => {
  const { account } = useContext(Web3Context);
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/posts/create", {
      method: "POST",
      body: JSON.stringify({
        title: title,
        body: body,
        authorAddress: account,
      }),
    });
    // window.location.reload();
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-4 h-full w-full bg-white p-4 rounded-xl">
      <input placeholder="Title" type="text" onChange={(e) => setTitle(e.target.value)} />
      <textarea
        className="input-box h-full p-3"
        placeholder="Body"
        type="text"
        onChange={(e) => setBody(e.target.value)}
      />
      <button onSubmit={(e) => handleSubmit(e)} type="submit" className="action-button-dark w-[12%] self-end">
        Post
      </button>
    </form>
  );
};

export default CreatePost;
