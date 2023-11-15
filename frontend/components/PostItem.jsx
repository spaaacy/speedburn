import { formatAddress, formatDate } from "@/util/helpers";
import UserImage from "./UserImage";

const PostItem = ({ post, user }) => {
  return (
    <div className="bg-pale flex flex-col rounded px-6 py-4 gap-4 mb-4">
      <div className="flex items-center gap-3">
        <UserImage displayPicture={user.image} />
        <p className="font-semibold">{user.username ?? formatAddress(user.address)}</p>
        <p className="font-light ml-auto ">{formatDate(post.createdAt)}</p>
      </div>
      <p className="mt-2 ">{post.title}</p>
      <p className="mt-2 ">{post.body}</p>
    </div>
  );
};

export default PostItem;
