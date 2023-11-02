import Image from "next/image";

const UserImage = ({displayPicture, onClick}) => {
  return (
    <Image
      src={displayPicture ? displayPicture : "assets/icons/account.svg"}
      alt="user_image"
      onClick={onClick}
      className="hover:cursor-pointer object-cover rounded-full w-[45px] h-[45px]"
      width={45}
      height={45}
    />
  );
};

export default UserImage;
