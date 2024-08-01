import React from "react";
import { Link, Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className=" h-screen flex flex-col items-center px-4 md:px-6">
      <div className="grid gap-10 border border-neutral-400 rounded-lg w-[700px] max-w-full mt-10 md:mt-20 p-5 md:p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
