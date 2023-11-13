'use client'

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Footer = () => {

  const [pathname, setPathname] = useState("/");

  useEffect(() => {
    setPathname(window.location.pathname);
  })


  // FIXME: Null error with window
  return (
    <footer className={`max-sm:text-xs ${pathname === "/" ? "absolute bottom-0" : "relative"} mt-auto w-full flex justify-center items-center p-2`}>
      <p className={`font-light ${usePathname() === "/" ? "text-white" : "text-black"}`}>Copyright © 2023 SpeedBurn. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
