import React, { useEffect } from "react";
// lib
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

// component
import SpinnerFullPage from "../Ui/SpinnerFullPage";
import Input from "./Input";
import { Dropdown } from "primereact/dropdown";

const Crud = ({
  getFunction,
  submitFunction,
  updateFunction,
  formList = [],
  addTitle = "",
  editTitle = "",
  allDataLink = "",
  loading = false,
  loadingGetData = false,
  isSubmiting = false,
  errors,
  handleSubmit,
  control,
  dirtyFields,
}) => {
  // function
  useEffect(() => {
    if (location.pathname.includes("edit")) {
      getFunction();
    }
  }, []);
  if (loadingGetData) return <SpinnerFullPage />;
  return (
    <div className="grid gap-8">
      <header className="flex items-center gap-2 justify-between">
        <Link
          to={allDataLink}
          className="text-blue-900  font-bold text-lg md:text-2xl  capitalize "
        >
          {location.pathname.includes("edit") ? editTitle : addTitle}
        </Link>
      </header>
      <form
        onSubmit={handleSubmit(
          location.pathname.includes("edit") ? updateFunction : submitFunction
        )}
        className="grid gap-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4  items-start">
          {formList?.map((item) => (
            <Controller
              name={item?.fieldName}
              control={control}
              rules={item.validator}
              render={({ field, fieldState: { error } }) =>
                item?.type === "input" ? (
                  <>
                    <Input
                      id={item?.id}
                      label={item?.label}
                      type={item?.inputType}
                      placeholder={item?.placeholder}
                      error={
                        error?.message || errors?.[item.fieldName]?.message
                      }
                      handleChange={field.onChange}
                      value={field.value}
                      disabled={isSubmiting}
                    />
                  </>
                ) : (
                  <div className="grid gap-2">
                    <label htmlFor={item?.label}>{item?.label}</label>
                    <Dropdown
                      inputId={item?.label}
                      options={item?.listData?.map((item) => ({
                        name: item?.name,
                        value: item?.value,
                      }))}
                      optionLabel="name"
                      onChange={field.onChange}
                      value={field.value}
                      className={` input !py-0  ${
                        error?.message || errors?.[item.fieldName]?.message
                          ? "border-red-700"
                          : ""
                      }`}
                      placeholder={item?.placeholder}
                    />
                  </div>
                )
              }
            />
          ))}
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link
            to={allDataLink}
            className="border border-blue-900 px-4 h-[38px] flex items-center justify-center text-blue-900 rounded-[4px] capitalize text-sm transition-all ease-in-out duration-300 hover:bg-blue-900 hover:text-white "
          >
            view all
          </Link>
          <button
            type="submit"
            disabled={
              Object.keys(dirtyFields)?.length > 0 ? false : true || loading
            }
            className=" disabled:bg-white disabled:text-gray-400 disabled:shadow-sm disabled:border-gray-400 flex items-center gap-2 outline-none shadow-none bg-blue-900 text-white text-sm border border-blue-900 hover:bg-white hover:text-blue-900 hover:border-blue-900 transition-all duration-300 ease-in-out px-4 h-[38px] rounded-[4px]"
          >
            Submit
            {loading && <Spinner className="w-[18px] h-[18px]" />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Crud;
