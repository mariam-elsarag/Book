import React, { Children, useState } from "react";

import ErrorMessage from "./ErrorMessage";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
const PasswordInput = ({
  id,
  label,
  value: inputValue,
  placeholder,
  error,
  handleChange,
  refrence,
  disabled = false,
  children,
  showForgetPassword = true,
  showErrorMessage = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const handleForgetPassword = async () => {
    console.log("handle");
  };
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="label flex gap-1">
        <span>{label}</span>
      </label>
      <div className="w-full relative">
        <input
          id={id}
          ref={refrence}
          type={showPassword ? "text" : "password"}
          value={inputValue}
          className={`input ${error ? "input-error" : null} `}
          placeholder={placeholder}
          onChange={handleChange}
          disabled={disabled}
        />

        <span
          onClick={toggleShowPassword}
          className={`absolute top-[50%] translate-y-[-50%] right-5 cursor-pointer`}
          role="button"
        >
          {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
        </span>
      </div>

      {showErrorMessage && error && <ErrorMessage message={error} />}
      {showForgetPassword && (
        <div className="flex items-center justify-between mt-2 gap-1">
          {children}
          <span
            role="button"
            onClick={() => handleForgetPassword()}
            className="text-primary-600 font-normal text-xs cursor-pointer"
          >
            Forget your password?
          </span>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
