import React from "react";
import { FaRegUser, FaBook } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { LuLogOut, LuShoppingCart, LuUsers } from "react-icons/lu";
import { FaRegCircleUser } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { resetAuth } from "../features/Auth/AuthSlice";
import { IoBookOutline } from "react-icons/io5";
const list = [
  { id: 0, icon: <LuUsers size={18} />, title: "Users", link: "users" },
  { id: 1, icon: <IoBookOutline size={18} />, title: "Books", link: "book" },
  {
    id: 2,
    icon: <LuShoppingCart size={18} />,
    title: "Orders",
    link: "orders",
  },
  {
    id: 2,
    icon: <FaRegUser size={18} />,
    title: "My Profile",
    link: "profile",
  },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profilePic, fullName } = useSelector((store) => store.auth);

  //  function
  const handleLogout = () => {
    dispatch(resetAuth());
    navigate("/", { replace: true });
  };
  return (
    <aside className="aside  bg-body border-r border-light-gray h-screen  py-8 px-3 ">
      <h1 className="flex items-center justify-center md:justify-start md:gap-2 text-white font-bold uppercase md:tracking-[5px] text-base md:text-lg mb-8">
        <span className="flex md:hidden">
          <IoBookOutline color="var(--primary-600)" size={20} />
        </span>
        <span className="hidden md:flex text-primary-600 ">Book Shop</span>
      </h1>
      <ul className="nav flex flex-col gap-2 flex-1">
        {list?.map((item) => (
          <NavLink
            key={item?.id}
            to={item?.link}
            className=" flex text-natural-light rounded-lg"
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
        <div
          onClick={handleLogout}
          role="button"
          className="flex-1 text-grey  items-center hover:text-primary-600 transition-all duration-300 ease-in-out gap-2 hidden sm:flex"
        >
          <LuLogOut size={20} />
          <span>Log out</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
