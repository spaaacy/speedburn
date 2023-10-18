"use client";

import Post from "@/components/Post";
import { Web3Context } from "@/context/Web3Context";
import { useContext } from "react";

const Home = () => {
  const { createPost } = useContext(Web3Context);

  return (
    <main className="flex-center flex-col max-width">
      <button
        type="button"
        className="action-button"
        onClick={() => createPost({ title: "This is a new post", body: "This is my body 👃" })}
      >
        Create post
      </button>
      <Post
        post={{
          title: "The tale of lorem and his ipsum...",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elit nunc, ornare vitae eros ac, ullamcorper tincidunt odio. Pellentesque sit amet arcu eget ipsum finibus gravida in eget turpis. Donec commodo ligula et libero condimentum, ut tempus mi ullamcorper. Integer non dui libero. Phasellus auctor et dolor a scelerisque. Sed vitae massa turpis. Duis diam ipsum, porta pulvinar porttitor eget, iaculis sed lectus. Nunc venenatis enim ut velit condimentum, sed rhoncus ex egestas. Morbi eros velit, imperdiet non odio in, blandit ultrices odio. Fusce tincidunt facilisis dolor, id varius quam malesuada eu. Vestibulum ante nisi, rhoncus sed magna vitae, condimentum luctus ligula. Nullam nec tellus in mauris scelerisque tincidunt.",
        }}
      />
    </main>
  );
};

export default Home;
