import React from "react";
import { Link } from "react-router-dom";

const Header = ({ title, link, children }) => {
  return (
    <header className="flex items-center gap-2 justify-between">
      <Link
        to={link}
        className="text-natural-dark font-bold text-lg md:text-2xl  capitalize"
      >
        {title}
      </Link>
      {children}
    </header>
  );
};

export default Header;
