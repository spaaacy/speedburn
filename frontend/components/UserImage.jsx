import Image from "next/image";

const UserImage = ({imageURL, onClick}) => {
  return (
    <Image
      src={imageURL ?? "assets/icons/account.svg"}
      onClick={onClick}
      className="hover:cursor-pointer object-cover rounded-full w-[45px] h-[45px]"
      alt="user_image"
      width={45}
      height={45}
    />
  );
};

export default UserImage;
