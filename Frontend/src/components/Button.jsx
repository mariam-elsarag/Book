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
  const base_style = `disabled:bg-transparent disabled:text-grey disabled:shadow flex md:min-w-[150px] items-center gap-2  justify-center text-center py-1 px-2 outline-none rounded-lg transition-all duration-300 ease-in-out h-[38px] md:h-[40px] text-sm  shadow-main-shadow hover:shadow-hover-shadow `;
  const styles = {
    primary: `${base_style} bg-primary-600 text-white hover:bg-primary-500 `,
    outline: `${base_style} border border-primary-600 hover:bg-primary-600 hover:text-white text-primary-600`,
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
