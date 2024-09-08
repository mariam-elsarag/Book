import React, { useState } from "react";
// lib
import { useSelector } from "react-redux";

// component
import Crud from "../../components/Crud";
import axios from "axios";
import { apiKey } from "../../utils/helper";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

const CrudUser = () => {
  const { id } = useParams();
  const { token } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const {
    setError,
    reset,
    setValue,
    control,
    formState: { errors, dirtyFields },
    handleSubmit,
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
    },
    mode: "onChange",
  });
  const list = [
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
      id: 4,
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
  // get user data
  const getUserData = async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    try {
      setLoading(true);
      const response = await axios.get(`${apiKey}/api/admin/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal,
      });

      const { first_name, last_name, email, role } = response.data.data;
      setValue("first_name", first_name);
      setValue("last_name", last_name);
      setValue("email", email);
      setValue("role", role);
    } catch (err) {
      console.log("error", err);
    } finally {
      setLoading(false);
    }
  };
  // handle submit user
  const handleSubmitUser = async (data) => {
    const controller = new AbortController();
    const signal = controller.signal;
    try {
      setLoadingSubmit(true);
      setIsSubmiting(true);
      const response = await axios.post(`${apiKey}/api/admin/add-user`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
        toast.success("Email send to User");
        reset();
      }
    } catch (err) {
      if (err?.response?.data?.errors?.includes("Duplicate email")) {
        setError("email", {
          message: "Email already exist",
          ref: "email",
        });
      } else {
        toast.error(err?.response?.data?.errors);
      }
    } finally {
      setLoadingSubmit(false);
      setIsSubmiting(false);
    }
  };
  // for update data
  const updateData = async (data) => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `${apiKey}/api/admin/user/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Successully edit user data");

        const { first_name, last_name, email, role } = response.data.user;
        setValue("first_name", first_name);
        setValue("last_name", last_name);
        setValue("email", email);
        setValue("role", role);
      }
    } catch (err) {
      console.log("error", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Crud
        formList={list}
        submitFunction={handleSubmitUser}
        updateFunction={updateData}
        getFunction={getUserData}
        isSubmiting={isSubmiting}
        errors={errors}
        loading={loadingSubmit}
        loadingGetData={loading}
        handleSubmit={handleSubmit}
        control={control}
        dirtyFields={dirtyFields}
        allDataLink="/users/list"
      />
    </div>
  );
};

export default CrudUser;
