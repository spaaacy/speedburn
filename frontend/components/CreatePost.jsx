import { Web3Context } from "@/context/Web3Context";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

const CreatePost = () => {
  const router = useRouter();
  const { account } = useContext(Web3Context);
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("/api/posts/create", {
        method: "POST",
        body: JSON.stringify({
          title: title,
          body: body,
          authorAddress: account,
        }),
      });
    } catch (error) {
      console.error(error);
    } finally {
      // FIXME: Page does not seem to refresh
      router.refresh();
    }
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="w-[720px] flex flex-col gap-4 h-[250px] p-4 rounded-xl bg-jet"
    >
      <input placeholder="Title" className="rounded-lg p-3" type="text" onChange={(e) => setTitle(e.target.value)} />
      <textarea
        className="p-3 rounded-lg flex-auto"
        placeholder="Body"
        type="text"
        onChange={(e) => setBody(e.target.value)}
      />
      <button onSubmit={(e) => handleSubmit(e)} type="submit" className="action-button w-[12%] self-end">
        Post
      </button>
    </form>
  );
};

export default CreatePost;
