import React from "react";
import { Outlet } from "react-router-dom";

const BookContainer = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default BookContainer;
