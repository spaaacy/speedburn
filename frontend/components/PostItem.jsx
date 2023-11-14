import { formatDate } from "@/util/helpers";
import UserImage from "./UserImage";

const PostItem = ({ post }) => {
  const { title, body, timestamp, username, image } = post;
  return (
    <div className="bg-pale flex flex-col rounded px-6 py-4 gap-4 mb-4">
      <div className="flex items-center gap-3">
        <UserImage displayPicture={image} />
        <p className="font-semibold ">{username}</p>
        <p className="font-light ml-auto ">{formatDate(timestamp)}</p>
      </div>
      <p className="mt-2 ">{title}</p>
      <p className="mt-2 ">{body}</p>
    </div>
  );
};

export default PostItem;
