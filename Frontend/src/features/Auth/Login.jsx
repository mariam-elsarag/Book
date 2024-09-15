import { useForm, Controller } from "react-hook-form";
import Input from "../../components/Input";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateAuth } from "./AuthSlice";
import Button from "../../components/Button";
import { apiKey } from "../../utils/helper";
import ErrorMessage from "../../components/ErrorMessage";
import { useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    control,
    setError,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({ mode: "onChange" });

  const onSubmit = async (data) => {
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      setLoading(true);
      const response = await axios.post(
        `${apiKey}/api/auth/login`,
        {
          email: data.email,
          password: data.password,
        },
        { signal }
      );

      if (response.status === 200) {
        if (response.data.user.role === "admin") {
          dispatch(
            updateAuth({
              token: response.data.token,
              fullName: response.data.user.full_name,
              profilePic: response.data.user.profile_img,
            })
          );
        } else {
          toast.error("You are not allowed to enter");
        }
      }
    } catch (err) {
      console.log("error", err);
      if (err?.response?.data?.errors === "Email or password is incorrect") {
        setError("email", {
          type: "manual",
          message: err?.response?.data?.errors,
        });
        setError("password", {
          type: "manual",
          message: err?.response?.data?.errors,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-body-bg h-screen sm:flex items-center justify-center">
      <section className="sm:grid flex flex-col justify-center sm:justify-normal gap-5 w-full h-full sm:h-auto sm:w-[400px] rounded-lg py-10 px-8 bg-white shadow">
        <header className="w-full grid gap-8">
          <h1 className="text-primary-600 text-xl font-bold tracking-[8px] text-center w-full">
            BOOK SHOP
          </h1>
          <p className="text-natural-light text-sm">
            Welcome back! Log in to your app account
          </p>
        </header>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 w-full">
          <Controller
            name="email"
            rules={{ required: "Email is required" }}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                error={error?.message}
                handleChange={field.onChange}
                inputValue={field.value}
              />
            )}
          />
          <Controller
            name="password"
            rules={{ required: "Password is required" }}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                error={error?.message}
                handleChange={field.onChange}
                inputValue={field.value}
              />
            )}
          />

          <Button loading={loading} role="submit">
            Login
          </Button>
        </form>
      </section>
    </div>
  );
};

export default Login;
