import React from "react";
import { Link } from "react-router-dom";
import Spinner from "../Ui/Spinner";

const Button = ({
  children,
  onClick,
  to,
  type = "primary",
  role = "button",
  disabled,
  loading,
  className,
  target,
}) => {
  const base_style = `flex items-center gap-2  justify-center text-center py-1 px-2 outline-none rounded-[4px] transition-all duration-300 ease-in-out h-[40px] text-sm font-bold shadow-main-shadow hover:shadow-hover-shadow `;
  const styles = {
    primary: `${base_style} bg-secondary text-white hover:bg-secodary-hover  `,
    outline: `${base_style} border border-secondary hover:bg-secondary hover:text-white text-secondary`,
    white: `${base_style} text-secondary rounded-full bg-white w-full hover:bg-secondary hover:text-white border hover:border-white `,
  };
  if (to)
    return (
      <Link target={target} className={`${styles[type]} ${className}`} to={to}>
        {children}
      </Link>
    );

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={role}
      className={`${styles[type]} ${className}`}
    >
      {children}
      {loading && <Spinner className=" w-[18px] h-[18px]" />}
    </button>
  );
};

export default Button;
