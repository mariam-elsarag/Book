import React, { useEffect } from "react";

const SpinnerFullPage = () => {
  useEffect(() => {
    // Dynamically create the script tag and append it to the document
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
    script.type = "module";
    document.body.appendChild(script);

    // Cleanup function to remove the script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-white w-full h-screen flex items-center justify-center">
      {/* Render the Lottie player using the custom element */}
      <dotlottie-player
        src="https://lottie.host/db8298ad-1358-4c6f-afb1-f271931ff0db/0TkH37ZWxw.json"
        background="transparent"
        speed="1"
        style={{ width: "300px", height: "300px" }}
        loop
        autoplay
      ></dotlottie-player>
    </div>
  );
};

export default SpinnerFullPage;
