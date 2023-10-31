import { Web3Context } from "@/context/Web3Context";
import { useContext, useState } from "react";

const CreatePost = () => {
  const { createPost } = useContext(Web3Context);
  const [body, setBody] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPost({ body });
    window.location.reload();
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="flex flex-col gap-4 h-full w-full bg-white p-4 rounded-xl"
    >
      <textarea
        className="input-box h-full p-3"
        placeholder="Body"
        type="text"
        onChange={(e) => setBody(e.target.value)}
      />
      <button
        onSubmit={(e) => handleSubmit(e)}
        type="submit"
        className="action-button-dark w-[12%] self-end"
      >
        Post
      </button>
    </form>
  );
};

export default CreatePost;
