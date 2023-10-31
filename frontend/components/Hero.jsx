import Image from "next/image";

const Hero = () => {
  return (
    <div className="">
      <div className="relative w-full h-[640px]">
        <Image src={"/assets/images/hero_bg.jpg"} className="-z-10" layout="fill" />
      </div>
      <div>

      </div>
      <h1 className="text-white text-3xl">Welcome to SpeedBurn</h1>
    </div>
  );
};

export default Hero;
