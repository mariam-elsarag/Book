import React from "react";
import Spinner from "./Spinner";

const SpinnerFullPage = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      <Spinner />
    </div>
  );
};

export default SpinnerFullPage;
