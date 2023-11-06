'use client'

import { usePathname } from "next/navigation";

const Footer = () => {

  return (
    <footer className="absolute bottom-0 w-full flex justify-center items-center p-2">
      <p className={`font-light ${usePathname() === "/" ? "text-white" : "text-black"}`}>Copyright © 2023 SpeedBurn. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
