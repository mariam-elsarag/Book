import React, { useEffect } from "react";
// lib
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

// component
import SpinnerFullPage from "../Ui/SpinnerFullPage";
import Input from "./Input";
import { Dropdown } from "primereact/dropdown";
import Spinner from "../Ui/Spinner";
import Button from "./Button";
import UploadFile from "./UploadFile";
import Textarea from "./Textarea";

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
                ) : item?.type === "file" ? (
                  <UploadFile
                    label={item?.label}
                    handleChange={field.onChange}
                    isMulti={false}
                    value={field.value}
                    error={error?.message || errors?.[item.fieldName]?.message}
                  />
                ) : item?.type === "textarea" ? (
                  <Textarea
                    id={item?.id}
                    label={item?.label}
                    type={item?.inputType}
                    placeholder={item?.placeholder}
                    error={error?.message || errors?.[item.fieldName]?.message}
                    handleChange={field.onChange}
                    value={field.value}
                    disabled={isSubmiting}
                  />
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
          <Button
            role="submit"
            // disabled={
            //   Object.keys(dirtyFields)?.length > 0 ? false : true || loading
            // }
          >
            Submit
            {loading && <Spinner className="w-[18px] h-[18px]" />}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Crud;
