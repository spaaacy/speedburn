import formatAddress from "@/util/formatAddress";
import formatDate from "@/util/formatDate";
import Image from "next/image";
import UserImage from "./UserImage";

const Post = ({ post }) => {
  const { body, timestamp, username, image } = post;
  return (
    <div className="w-full bg-white flex flex-col items-start justify-center rounded-md shadow-xl px-6 py-4 gap-4 mb-4">
      <div className="flex-center w-full gap-3">
        <UserImage imageURL={image} />
        <p className="font-semibold">{username}</p>
        <p className="font-light justify-self-center ml-auto">{formatDate(timestamp)}</p>
      </div>
      <div className="flex-col items-start justify-center">
        <p className="mt-2">{body}</p>
      </div>
    </div>
  );
};

export default Post;
