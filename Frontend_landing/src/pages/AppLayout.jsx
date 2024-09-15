import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Ui/Footer";
import Navbar from "../Ui/Navbar";

const AppLayout = () => {
  return (
    <div className="main_layout">
      <div>
        <Navbar />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;
