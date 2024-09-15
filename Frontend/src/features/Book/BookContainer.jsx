import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../../Ui/Header";
import Button from "../../components/Button";
import { GoPlus } from "react-icons/go";

const BookContainer = () => {
  const navigate = useNavigate();
  const [hideButton, setHideButton] = useState(
    location.pathname.includes("/book/all") ? true : false
  );
  useEffect(() => {
    setHideButton(location.pathname.includes("/book/all") ? true : false);
  }, [location.pathname]);
  return (
    <div className="grid gap-8">
      <Header
        title={
          location.pathname.includes("book/add")
            ? "Add Book"
            : location.pathname.includes("edit")
            ? "Edit Book"
            : "All Books"
        }
        link={"/users/list"}
      >
        {hideButton && (
          <Button
            onClick={() => {
              navigate("/book/add");
            }}
          >
            <span>
              <GoPlus size={20} />
            </span>
            <span className="text-sm md:text-base">Add Book</span>
          </Button>
        )}
      </Header>
      <Outlet />
    </div>
  );
};

export default BookContainer;
