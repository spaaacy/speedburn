import Image from "next/image";

const Hero = () => {
  return (
    <div className="w-full h-[640px] bg-black">
      <div className="-z-10 opacity-50">
        <Image src={"/assets/images/hero_bg.jpg"} alt="hero_bg" layout="fill" />
      </div>
      <div className="flex relative justify-end items-center h-full mr-10">
        <h1 className="text-white text-8xl text-right">
          Welcome to
          <br />
          SpeedBurn
        </h1>
      </div>
    </div>
  );
};

export default Hero;
