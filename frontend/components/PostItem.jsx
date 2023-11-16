import { formatAddress, formatDate } from "@/util/helpers";
import UserImage from "./UserImage";
import Image from "next/image";

const PostItem = ({ post, user, handleClick }) => {

  return (
    <div className="bg-pale flex flex-col rounded px-6 py-4 gap-4 mb-4 hover:cursor-pointer" onClick={() => handleClick({post, user})}>
      <div className="flex items-center gap-3">
        <UserImage displayPicture={user.image} />
        <p className="font-semibold">{user.username ?? formatAddress(user.address)}</p>
        <p className="font-light ml-auto ">{formatDate(post.createdAt)}</p>
      </div>
      <p className="mt-2 ">{post.title}</p>
      <p className="mt-2 ">{post.body}</p>
      <div className="flex items-center mt-2 px-2 gap-2">
        <Image alt="like_icon" src={'/assets/icons/heart.svg'} width={20} height={20} />
        <p>20</p>
        <Image className="ml-10" alt="comments_icon" src={'/assets/icons/comments.svg'} width={20} height={20} />
        <p>20</p>
        <Image className="ml-auto" alt="report_icon" src={'/assets/icons/report.svg'} width={20} height={20} />
      </div>
    </div>
  );
};

export default PostItem;
