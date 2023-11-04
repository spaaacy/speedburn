import Image from "next/image";

const Hero = () => {
  return (
    <div className="w-full h-[640px] bg-black flex relative">
      <div className="flex-1 relative opacity-80">
        <Image src={"/assets/images/hero_bg.jpg"} alt="hero_bg" layout="fill" />
      </div>
      <div className="absolute mt-36 flex items-center ml-40">
        <h1 className="text-blue-100 fireorange text-8xl text-left mix-blend-difference">
          Welcome to
          <br />
          <span className="text-fireorange">SpeedBurn</span>
        </h1>
      </div>
    </div>
  );
};

export default Hero;
