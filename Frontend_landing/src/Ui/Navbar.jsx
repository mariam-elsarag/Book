import React from "react";
import { IoBookOutline } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";
import Button from "../components/Button";
const list = [
  { id: 0, link: "/home", linkName: "Home" },
  { id: 1, link: "/books", linkName: "Books" },
];
const Navbar = () => {
  return (
    <nav
      className={` h-[70px] w-full flex items-center border-b border-gray-100 `}
    >
      <div className="Container flex items-center justify-between gap-4 ">
        {/* logo */}
        <Link
          to="/"
          className="flex items-center justify-center md:justify-start gap-2 text-white font-bold uppercase md:tracking-[5px] text-base "
        >
          <IoBookOutline color="var(--primary-600)" size={20} />
          <span className=" text-primary-600 ">Book Shop</span>
        </Link>
        <ul className="nav flex items-center gap-5">
          {list?.map((item) => (
            <li className="" key={item?.id}>
              <NavLink
                className="text-grey hover:text-primary-600 transition-all ease-in-out duration-300 "
                to={item?.link}
              >
                {item?.linkName}
              </NavLink>
            </li>
          ))}
        </ul>
        <Button to="/login" type="outline" className="!min-w-[100px]">
          Login
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
