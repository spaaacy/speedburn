import formatAddress from "@/util/formatAddress";
import formatDate from "@/util/formatDate";
import Image from "next/image";

const Post = ({ post }) => {
  const { title, body, timestamp, author } = post;
  return (
    <div className="max-w-[680px] w-full bg-white flex flex-col items-start justify-center rounded-md shadow-xl px-6 py-4 gap-4 mb-4">
      <div className="flex-center w-full">
        <Image src={"assets/icons/account.svg"} className="mr-2" alt="user_image" width={40} height={40} />
        <p className="font-semibold">{formatAddress(author)}</p>
        <p className="font-light justify-self-center ml-auto">{formatDate(timestamp)}</p>
      </div>
      <div className="flex-col items-start justify-center">
        <h2 className="font-bold">{title}</h2>
        <p className="mt-2">{body}</p>
      </div>
    </div>
  );
};

export default Post;
