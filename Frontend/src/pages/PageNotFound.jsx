import React, { useEffect } from "react";
import Button from "../components/Button";

const PageNotFound = () => {
  useEffect(() => {
    // Dynamically append the Lottie player script
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
    script.type = "module";
    document.body.appendChild(script);

    // Clean up the script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-3 justify-center bg-[#fafafa] items-center">
      <dotlottie-player
        src="https://lottie.host/dd5ec855-fd7e-4e6b-bb8a-ce5006b3134b/SOrYxnHqzZ.json"
        background="transparent"
        speed="1"
        style={{ width: "500px", height: "300px" }}
        loop
        autoplay
      ></dotlottie-player>
      <Button
        to="/"
        className="min-w-[150px] rounded-lg bg-primary hover:bg-primary-hover"
      >
        Go to home
      </Button>
    </div>
  );
};

export default PageNotFound;
