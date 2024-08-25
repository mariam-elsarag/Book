import React from "react";
import { Outlet } from "react-router-dom";

const UserContainer = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default UserContainer;
