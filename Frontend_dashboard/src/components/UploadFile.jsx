import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import ErrorMessage from "./ErrorMessage";

const UploadFile = ({ handleChange, label, error, value }) => {
  const [img, setImg] = useState(value);
  const handleImageChange = (event) => {
    const image = event.target.files[0];
    setImg(URL.createObjectURL(image));
    handleChange(image);
  };

  const removeImg = () => {
    setImg(null);
    handleChange(null);
  };
  return (
    <div className="grid gap-2">
      <label htmlFor={label}>{label}</label>
      <label
        htmlFor="uploadImg"
        className={`input ${error ? "input-error" : null} `}
      ></label>
      {img && (
        <figure className="relative w-fit">
          <span
            role="button"
            onClick={removeImg}
            className="w-[15px] h-[15px] bg-error rounded-full flex items-center justify-center absolute right-[-10px] top-[-10px]"
          >
            <IoMdClose color="#FFF" />
          </span>
          <img src={img} className="w-14 h-14 object-cover object-center" />
        </figure>
      )}
      {error && <ErrorMessage message={error} />}
      <input
        type="file"
        id="uploadImg"
        className="hidden"
        accept="image/*"
        onChange={(e) => handleImageChange(e)}
      />
    </div>
  );
};

export default UploadFile;
