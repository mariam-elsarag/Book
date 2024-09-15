import React, { useState } from "react";
import Input from "../../components/Input";
import { Controller, useForm } from "react-hook-form";
import Button from "../../components/Button";
import PasswordInput from "../../components/PasswordInput";
import { Checkbox } from "primereact/checkbox";
import axios from "axios";
import { apiKey } from "../../utils/helper";
import { toast } from "react-toastify";
const Form = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="grid gap-8 justify-center md:justify-start">
      <div className="form-container">
        <div className="form-container">
          <div
            className={`form-wrapper ${
              !showLogin ? "translate-register" : ""
            } `}
          >
            <Login setShowLogin={setShowLogin} />
            <Register setShowLogin={setShowLogin} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Login = ({ setShowLogin }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const formList = [
    {
      id: 1,
      type: "input",
      fieldName: "email",
      label: "Email",
      inputType: "email",
      placeholder: "Enter your email",
      validator: {
        required: "Email is required",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Email is invalid",
        },
      },
    },
    {
      id: 2,
      type: "password",
      fieldName: "password",
      label: "Password",
      inputType: "password",
      placeholder: "Enter your password",
      validator: {
        required: "Password is required",
        pattern: {
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
          message:
            "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one special character",
        },
      },
    },
  ];

  const onSubmit = (data) => {
    setIsSubmitting(true);
    // Handle login submission logic
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form flex flex-col gap-4"
      >
        <h1 className="text-[30px] font-bold text-primary-600">Login</h1>
        {formList.map((item) => (
          <Controller
            key={item.fieldName}
            name={item.fieldName}
            control={control}
            rules={item.validator}
            render={({ field, fieldState: { error } }) => (
              <>
                {item?.type === "input" ? (
                  <Input
                    label={item.label}
                    type={item.inputType}
                    placeholder={item.placeholder}
                    error={error?.message || errors?.[item.fieldName]?.message}
                    handleChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  />
                ) : (
                  <PasswordInput
                    label={item.label}
                    type={item.inputType}
                    placeholder={item.placeholder}
                    error={error?.message || errors?.[item.fieldName]?.message}
                    handleChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center gap-1">
                      <Checkbox
                        inputId="rememberme"
                        onChange={(e) => setRememberMe(e.checked)}
                        checked={rememberMe}
                      ></Checkbox>
                      <label
                        htmlFor="rememberme"
                        className={`text-sm ${
                          rememberMe ? "text-primary-600" : "text-grey"
                        }`}
                      >
                        Remember me
                      </label>
                    </div>
                  </PasswordInput>
                )}
              </>
            )}
          />
        ))}
        <Button> Login</Button>
      </form>
      <p className="text-sm text-grey">
        Don't have an Account?{" "}
        <span
          role="button"
          onClick={() => setShowLogin(false)}
          className="text-primary-600"
        >
          Register
        </span>
      </p>
    </div>
  );
};

const Register = ({ setShowLogin }) => {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    setError,
    reset,
    formState: { errors, dirtyFields, isValid },
    handleSubmit,
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const formList = [
    {
      id: 1,
      type: "input",
      fieldName: "first_name",
      label: "First name",
      inputType: "text",
      placeholder: "Enter your First name",
      validator: {
        required: "First name is required",
        maxLength: {
          value: 20,
          message: "First name cannot exceed 20 characters",
        },
      },
    },
    {
      id: 1,
      type: "input",
      fieldName: "last_name",
      label: "Last name",
      inputType: "text",
      placeholder: "Enter your Last name",
      validator: {
        required: "Last name is required",
        maxLength: {
          value: 20,
          message: "Last name cannot exceed 20 characters",
        },
      },
    },
    {
      id: 1,
      type: "input",
      fieldName: "email",
      label: "Email",
      inputType: "email",
      placeholder: "Enter your email",
      validator: {
        required: "Email is required",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Email is invalid",
        },
      },
    },
    {
      id: 2,
      type: "password",
      fieldName: "password",
      label: "Password",
      inputType: "password",
      placeholder: "Enter your password",
      validator: {
        required: "Password is required",
        pattern: {
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
          message:
            "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one special character",
        },
      },
    },
  ];

  const onSubmit = async (data) => {
    const controller = new AbortController();
    const signal = controller.signal;
    try {
      setIsSubmitting(true);
      setLoading(true);
      const response = await axios.post(`${apiKey}/api/auth/register`, data, {
        signal,
      });
      if (response.status === 201) {
        reset();
        toast.success("Successfully create a new account");
        setShowLogin(true);
      }
    } catch (err) {
      if (err?.response?.data?.errors.includes("Duplicate email")) {
        setError("email", {
          message: "Email already exist",
        });
      }
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
    // Handle registration submission logic
  };

  return (
    <div className="">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 form"
      >
        <h1 className="text-[30px] font-bold text-primary-600">Register</h1>
        <div className="grid grid-cols-2 gap-2">
          {formList?.slice(0, 2)?.map((item) => (
            <Controller
              key={item.fieldName}
              name={item.fieldName}
              control={control}
              rules={item.validator}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    label={item.label}
                    type={item.inputType}
                    placeholder={item.placeholder}
                    error={error?.message || errors?.[item.fieldName]?.message}
                    handleChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  />
                </>
              )}
            />
          ))}
        </div>
        {formList?.slice(2).map((item) => (
          <Controller
            key={item.fieldName}
            name={item.fieldName}
            control={control}
            rules={item.validator}
            render={({ field, fieldState: { error } }) => (
              <>
                {item?.type === "input" ? (
                  <Input
                    label={item.label}
                    type={item.inputType}
                    placeholder={item.placeholder}
                    error={error?.message || errors?.[item.fieldName]?.message}
                    handleChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  />
                ) : (
                  <PasswordInput
                    label={item.label}
                    type={item.inputType}
                    placeholder={item.placeholder}
                    error={error?.message || errors?.[item.fieldName]?.message}
                    handleChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                    showForgetPassword={false}
                  />
                )}
              </>
            )}
          />
        ))}
        <Button role="submit" loading={loading} disabled={!isValid || loading}>
          Register
        </Button>
      </form>
      <p className="text-sm text-grey">
        Already have an account?{" "}
        <span
          role="button"
          onClick={() => setShowLogin(true)}
          className="text-primary-600"
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default Form;
