import React from "react";
import Button from "../components/Button";

const PageNotFound = () => {
  return (
    <div className="pageNotFound h-screen w-full">
      {Array.from({ length: 5 }, (_, i) => (
        <span className="bubble" key={i}></span>
      ))}
      <div className="main">
        <h1>404</h1>
        <div className="flex items-center gap-2 flex-col">
          <p> It looks like you're lost...</p>
          <Button type="white" to="/">
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
