import { Web3Context } from "@/context/Web3Context";
import { useContext, useState } from "react";

const CreatePost = ({ communityId }) => {
  const { user } = useContext(Web3Context);
  const [expanded, setExpanded] = useState(false);
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`/api/posts/create`, {
        method: "POST",
        body: JSON.stringify({
          title,
          body,
          community: communityId,
          author: user._id,
        }),
      });
    } catch (error) {
      console.error(error);
    } finally {
      window.location.reload()
    }
  };

  return (
    <>
      {expanded ?
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="flex flex-col gap-4 h-[250px] p-4 rounded-2xl bg-pale"
        >
          <input placeholder="Title" className="rounded-lg p-3" type="text" onChange={(e) => setTitle(e.target.value)} />
          <textarea
            className="p-3 rounded-lg flex-auto"
            placeholder="Body"
            type="text"
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="flex justify-between">
            <button onClick={() => setExpanded(false)} type="button" className="action-button">
              Close
            </button>
            <button onSubmit={(e) => handleSubmit(e)} type="submit" className="action-button">
              Post
            </button>
          </div>
        </form> : <button className="action-button border-2 border-transparent hover:text-jet bg-pale hover:border-fire rounded" type="button" onClick={() => setExpanded(true)}>
          Create Post
        </button>}

    </>
  );
};

export default CreatePost;
