import { formatDate } from "@/util/helpers";
import UserImage from "./UserImage";

const Post = ({ post }) => {
  const { body, timestamp, username, image } = post;
  return (
    <div className="w-full bg-jet flex flex-col items-start justify-center rounded-md shadow-xl px-6 py-4 gap-4 mb-4">
      <div className="flex justify-center items-center w-full gap-3">
        <UserImage displayPicture={image} />
        <p className="font-semibold text-white">{username}</p>
        <p className="font-light justify-self-center ml-auto text-white">{formatDate(timestamp)}</p>
      </div>
      <div className="flex-col items-start justify-center">
        <p className="mt-2 text-white">{body}</p>
      </div>
    </div>
  );
};

export default Post;
