import React from "react";
import Crud from "../../components/Crud";

const CrudUser = () => {
  const formList = [
    {
      id: 1,
      type: "input",
      fieldName: "first_name",
      label: "First Name",
      inputType: "text",
      placeholder: "First Name",
      validator: {
        required: "First name is required",
      },
    },
    {
      id: 2,
      type: "input",
      fieldName: "last_name",
      label: "Last Name",
      inputType: "text",
      placeholder: "enter user last name",
      validator: {
        required: "Last name is required",
      },
    },
    {
      id: 3,
      type: "input",
      fieldName: "email",
      label: "Email",
      inputType: "email",
      placeholder: "Enter user email",
      validator: {
        required: "Email is required",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Email is invalid",
        },
      },
    },
    {
      id: 3,
      label: "Role",
      type: "dropdown",
      fieldName: "role",
      listData: [
        { name: "User", value: "user" },
        { name: "Admin", value: "admin" },
      ],
      placeholder: "Select user role",
    },
  ];
  return (
    <div>
      <Crud formList={formList} />
    </div>
  );
};

export default CrudUser;
