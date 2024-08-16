import React from "react";
import { FaRegUser, FaBook } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { LuLogOut, LuUsers } from "react-icons/lu";
import { FaRegCircleUser } from "react-icons/fa6";
import { useSelector } from "react-redux";

const list = [
  { id: 0, icon: <LuUsers size={18} />, title: "Users", link: "users" },
  { id: 1, icon: <FaBook size={18} />, title: "Books", link: "book" },
  {
    id: 2,
    icon: <FaRegUser size={18} />,
    title: "My Profile",
    link: "profile",
  },
];

const Sidebar = () => {
  const { profilePic, fullName } = useSelector((store) => store.auth);
  return (
    <aside className="aside  bg-blue-950 h-screen  py-8 px-3 ">
      <h1 className="flex items-center justify-center md:justify-start md:gap-2 text-white font-bold uppercase md:tracking-[5px] text-base md:text-lg mb-8">
        <FaBook size={18} />
        <span className="hidden md:flex">Book Shop</span>
      </h1>
      <ul className="nav flex flex-col gap-2 flex-1">
        {list?.map((item) => (
          <NavLink
            key={item?.id}
            to={item?.link}
            className=" flex text-white/90 rounded-[4px]"
          >
            <li className={`flex items-center  h-[40px] `}>
              <span className="flex items-center justify-center w-[40px]  h-full">
                {item?.icon}
              </span>
              <span className="text-base aside_title ">{item?.title}</span>
            </li>
          </NavLink>
        ))}
      </ul>
      <div className="bg-white rounded-[4px] flex h-[40px] items-center gap-1 px-3">
        <div className="flex-1  items-center gap-2 hidden sm:flex">
          {profilePic ? (
            <img
              src={profilePic}
              className="w-[20px] h-[20px] object-cover object-center rounded-full"
            />
          ) : (
            <FaRegCircleUser size={20} color="#172554" />
          )}
          <span>{fullName}</span>
        </div>
        <LuLogOut size={20} />
      </div>
    </aside>
  );
};

export default Sidebar;
