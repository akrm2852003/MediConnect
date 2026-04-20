import React from "react";
import logo from "../../../assets/Logos/MainLogo.svg";
import "../../FormStyle/FormStyle.css";

import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Register() {
  let {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ mode: "onChange" });

  const password = watch("password");

  let navigate = useNavigate();
  let [showPassword, setShowPassword] = useState(false);
  let [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const nextStep = () => {
    setStep(step + 1);
  };
  const prevStep = () => {
    setStep(step - 1);
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await axios.post(
        "https://mediconnect-api.online/api/users/register",
        data,
      );
       console.log('Register successful:', response.data);
      navigate("/login");
      console.log(response);

      toast.success("Register successful");
    } catch (error) {
     
      console.log(error);
      
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
                Sign Up
              </h1>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-6 mb-6 md:grid-cols-1 w-[80%] m-auto">
                  {/* ================= STEP 1 ================= */}
                  {step === 1 && (
                    <div className="step1">
                      <div>
                        <label className="block mb-2.5 text-sm font-medium text-heading">
                          First name
                        </label>
                        <input
                          {...register("name", { required: true })}
                          type="text"
                          className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="block mb-2.5 text-sm font-medium text-heading">
                          Email
                        </label>
                        <input
                          {...register("email", { required: true })}
                          type="email"
                          className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="block mb-2.5 text-sm font-medium text-heading">
                          Password
                        </label>

                        <div className="relative">
                          <input
                            {...register("password", { required: true })}
                            type={showPassword ? "text" : "password"}
                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 pr-10 shadow-xs"
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
                      </div>

                      <div>
                        <label className="block mb-2.5 text-sm font-medium text-heading">
                          Confirm Password
                        </label>

                        <div className="relative">
                          <input
                            {...register("confirmPassword", {
                              validate: (value) =>
                                value === watch("password") ||
                                "Passwords don't match",
                            })}
                            type={showConfirmPassword ? "text" : "password"}
                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 pr-10 shadow-xs"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          >
                            <FontAwesomeIcon
                              icon={showConfirmPassword ? faEyeSlash : faEye}
                            />
                          </button>
                        </div>

                      </div>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="block mt-10 rounded-[13px] w-[100%] m-auto text-primaryLight bg-white border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs text-sm px-4 py-2.5"
                      >
                        Next
                      </button>
                    </div>
                  )}

                  {/* ================= STEP 2 ================= */}
                  {step === 2 && (
                    <div className="step2">
                      <div>
                        <label className="block mb-2.5 text-sm font-medium text-heading">
                          Phone number
                        </label>
                        <input
                          {...register("phone", { required: true })}
                          type="tel"
                          className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="block mb-2.5 text-sm font-medium text-heading">
                          Age
                        </label>
                        <input
                          {...register("age", { required: true })}
                          type="number"
                          className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="block mb-2.5 text-sm font-medium text-heading">
                          National ID
                        </label>
                        <input
                          {...register("national_id", { required: true })}
                          type="text"
                          className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="block mb-2.5 text-sm font-medium text-heading">
                          Birth Date
                        </label>
                        <input
                          {...register("birth_date", { required: true })}
                          type="date"
                          className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs"
                        />
                      </div>

                      {/* Gender */}
                      <div className="mb-6 mt-3 flex justify-around">
                        <div className="child flex ">
                          <label className="block mx-3 text-sm font-medium text-heading">
                            Male
                          </label>
                          <input
                            {...register("gender", { required: true })}
                            value="ذكر"
                            type="radio"
                          />
                        </div>

                        <div className="child flex ">
                          <label className="block mx-3 text-sm font-medium text-heading">
                            Female
                          </label>
                          <input
                            {...register("gender", { required: true })}
                            value="أنثى"
                            type="radio"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-2.5 text-sm font-medium text-heading">
                          Medical History
                        </label>
                        <input
                          {...register("medical_history")}
                          type="text"
                          placeholder="ضغط الدم, سكر"
                          className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base block w-full px-3 py-2.5 shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="block mb-2.5 text-sm font-medium text-heading">
                          Current Medications
                        </label>
                        <input
                          {...register("current_medications")}
                          type="text"
                          placeholder="دواء الضغط"
                          className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base block w-full px-3 py-2.5 shadow-xs"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={prevStep}
                        className="block rounded-[13px] w-[100%] m-auto text-primaryLight bg-white border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs text-sm px-4 py-2.5"
                      >
                        Back
                      </button>

                      <button
                        type="submit"
                        className="block mt-3 rounded-[13px] w-[100%] m-auto mb-2.5 text-white bg-primaryLight border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs text-sm px-4 py-2.5"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
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
export default Register;
