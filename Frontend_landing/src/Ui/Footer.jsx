import React from "react";
import { IoBookOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="border-t border-gray-200 py-5">
      <div className=" Container flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* logo */}
        <Link
          to="/"
          className="flex items-center justify-center md:justify-start gap-2 text-white font-bold uppercase md:tracking-[5px] text-base "
        >
          <IoBookOutline color="var(--primary-600)" size={20} />
          <span className=" text-primary-600 ">Book Shop</span>
        </Link>
        <p className="text-grey text-sm md:text-base">
          All copy right reserved to Book Shop
        </p>
      </div>
    </footer>
  );
};

export default Footer;
