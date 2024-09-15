import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../../Ui/Header";
import Button from "../../components/Button";
import { GoPlus } from "react-icons/go";

const UserContainer = () => {
  const navigate = useNavigate();
  const [hideButton, setHideButton] = useState(
    location.pathname.includes("/users/list") ? true : false
  );
  useEffect(() => {
    setHideButton(location.pathname.includes("/users/list") ? true : false);
  }, [location.pathname]);
  return (
    <div className="grid gap-8">
      <Header
        title={
          location.pathname.includes("users/add")
            ? "Add user"
            : location.pathname.includes("edit")
            ? "Edit user"
            : "All users"
        }
        link={"/users/list"}
      >
        {hideButton && (
          <Button
            onClick={() => {
              navigate("/users/add");
            }}
          >
            <span>
              <GoPlus size={20} />
            </span>
            <span className="text-sm md:text-base">Add User</span>
          </Button>
        )}
      </Header>
      <Outlet />
    </div>
  );
};

export default UserContainer;
