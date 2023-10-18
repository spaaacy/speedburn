import Image from "next/image";

const Post = ({ post }) => {
  const { title, body } = post;
  return (
    <div className="max-w-[680px] w-full bg-white flex flex-col items-start justify-center rounded-md shadow-xl px-6 py-4 gap-4">
      <div className="flex-center">
        <Image src={"assets/icons/account.svg"} className="mr-2" alt="user_image" width={40} height={40} />
        <p className="font-semibold">prince_221</p>
      </div>
      <div className="flex-col items-start justify-center">
        <h2 className="font-bold">{title}</h2>
        <p className="mt-2">{body}</p>
      </div>
      {/* <p className="font-light">{formatDate(timestamp)}</p> */}
      {/* <p className="mt-5 italic self-end">{formatAddress(author)}</p> */}
    </div>
  );
};

export default Post;
