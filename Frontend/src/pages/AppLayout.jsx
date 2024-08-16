import React from "react";
import { Link, Outlet } from "react-router-dom";
import Sidebar from "../Ui/Sidebar";
import PageLayout from "../Ui/PageLayout";

const AppLayout = () => {
  return (
    <div className="flex items-start gap-3 h-screen">
      <Sidebar />
      <PageLayout>
        <Outlet />
      </PageLayout>
    </div>
  );
};

export default AppLayout;
