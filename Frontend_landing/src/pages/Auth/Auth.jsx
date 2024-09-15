import React, { useEffect } from "react";
import { login } from "../../assets/images/Image";
import Form from "./Form";
import Aos from "aos";

const Auth = () => {
  useEffect(() => {
    Aos.init();
  }, []);
  return (
    <div
      data-aos="fade-up"
      data-aos-easing="ease-out-cubic"
      data-aos-offset={0}
      data-aos-duration={1000}
      className="auth h-[calc(100vh_-_135px)] "
    >
      <div className="Container flex justify-center md:justify-start items-center h-full">
        <div className="w-full sm:w-1/2 h-full flex flex-col justify-center">
          <Form />
        </div>
        <figure className=" h-full w-1/2 hidden md:flex flex-col items-center justify-center">
          <img src={login} className="w-[400px] h-[400px] object-contain" />
        </figure>
      </div>
    </div>
  );
};

export default Auth;
