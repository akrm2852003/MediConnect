import React, { useContext } from "react";
import logo from "../../../assets/Logos/MainLogo.svg";
import "../../FormStyle/FormStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { AuthContext } from "../../../Conetxt/AuthContext/AuthContext";

function Login() {
  let { saveLoginData } = useContext(AuthContext);
  let {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ mode: "onChange" });
  const password = watch("password");
  let navigate = useNavigate();
  let [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await axios.post(
        "https://mediconnect-api.online/api/users/login",
        data,
      );

      const user = response.data.data.user;
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      saveLoginData();
      navigate("/dashboard");
      console.log(response);

      toast.success("Register successful");
    } catch (error) {
      toast.error(error.response.data.message, {
        autoClose: 5000,
        theme: "dark",
      });
    }
  };
  return (
    <>
      <div className="auth-container flex align-center ">
        <div className="m-auto w-[100%]  ">
          <div className="content">
            <div className="logo flex justify-center items-center mb-3">
              <img src={logo} className="w-50" alt="this is logo image" />
              <h1 className="text-primaryLight font-bold text-5xl">
                MediConnect
              </h1>
            </div>

            <div className="flex justify-center items-center flex-wrap">
              <div className=" form-container w-full sm:w-full md:w-10/12 lg:w-8/12 xl:w-7/12">
                <h1 className="text-center text-[#026B98] mb-8 font-bold text-5xl">
                  Login
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="  grid gap-6 mb-6 md:grid-cols-1 w-[80%] m-auto   ">
                    <div className="step1">
                      <div>
                        <label
                          htmlFor="email"
                          className="block mb-2.5 text-sm font-medium text-heading"
                        >
                          Email
                        </label>
                        <input
                          {...register("email", {
                            required: "email is required",
                          })}
                          type="text"
                          id="email"
                          className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                          placeholder="example@gmail.com"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="password"
                          className="block mb-2.5 text-sm font-medium text-heading"
                        >
                          Password
                        </label>
                        <input
                          {...register("password", {
                            required: "password is required",
                          })}
                          type={showPassword ? "text" : "password"}
                          id="password"
                          className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                          placeholder="●●●●●●●●●●●"
                          required
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3  top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                          />
                        </button>
                      </div>

                      <div className="text-end mt-2.5">
                        <Link
                          to="/ForgetPassword"
                          className="text-[#5B8099] text-decoration-none"
                        >
                          Forgot Password ?
                        </Link>
                      </div>
                      <button
                        type="submit"
                        className=" block mt-5 rounded-[13px] w-[100%] m-auto mb-2.5 text-white bg-primaryLight box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                      >
                        Login
                      </button>

                      <div className="text-center">
                        <span className="text-[#052755A3] me-3">
                          Don't have an account ?
                        </span>
                        <Link
                          to="/register"
                          className="text-primary text-decoration-none"
                        >
                          Register Now ?
                        </Link>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;
