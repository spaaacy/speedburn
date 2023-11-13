import Image from "next/image";

const UserImage = ({displayPicture, onClick, size}) => {
  return (
    <Image
      src={displayPicture ? displayPicture : "/assets/icons/account.svg"}
      alt="user_image"
      onClick={onClick}
      className={`${onClick ? "hover:cursor-pointer" : ""} ${size ? `w-[${size}px] h-[${size}px]` : "w-[45px] h-[45px]"} object-cover rounded-full border-2 border-transparent`}
      width={size ?? 45}
      height={size ?? 45}
    />
  );
};

export default UserImage;
