import React from "react";
import Header from "../../../SharedModule/Components/Header/Header";
import img from "../../../assets/images/HeaderImg/Home-Header.png";
import icon1 from "../../../assets/Icons/HomeIcons/icon1.svg";
import icon2 from "../../../assets/Icons/HomeIcons/icon2.svg";
import icon3 from "../../../assets/Icons/HomeIcons/icon3.svg";
import icon4 from "../../../assets/Icons/HomeIcons/icon4.svg";
import icon5 from "../../../assets/Icons/HomeIcons/icon5.svg";
import aboutImg from "../../../assets/images/HomeImg/aboutImg.png";
import styles from "./Home.module.css";
export default function Home() {
  const values = [
    {
      title: "Accessibility",
      description:
        "We ensure that healthcare information is easy to access for all users, regardless of ability, device, or location — healthcare for everyone.",
      icon: icon1,
    },
    {
      title: "Privacy & Security",
      description:
        "We protect your medical data with strict encryption and secure systems, ensuring your information stays private and handled with complete confidentiality.",
      icon: icon2,
    },
    {
      title: "Reliability",
      description:
        "We deliver consistent performance and trusted service, giving users confidence that healthcare access will work smoothly anytime they need it.",
      icon: icon3,
    },
    {
      title: "Efficiency",
      description:
        "We streamline booking and discovery to reduce waiting time, helping users reach doctors, hospitals, and services quickly with no unnecessary steps.",
      icon: icon4,
    },
  ];

  return (
    <>
      <Header
        title1={"Your health first"}
        title2={"Care when you need it"}
        description={
          "Discover hospitals instantly,Book appointments\nin seconds and Connect with trustedhealthcare \n providers seamlessly."
        }
        imgUrl={img}
      />

      <div className="container m-auto  ">
        <button className=" block  rounded-[13px] w-[100%] m-auto my-[50px] text-white bg-primaryLight  hover:bg-primaryDark text-xl font-bold py-4 py-2.5 ">
          Book Your Appointment Now
        </button>

        <div className="our-values ">
          <h1 className="text-primaryLight font-bold text-[52.19px] pb-[30px] text-center">
            Our Values
          </h1>

          <div className="our-values-childs grid  gap-y-12 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 ">
            {values.map(function (val, i) {
              return (
                <>
                  <div
                    key={i}
                    className={`${styles.card} child w-[80%] px-10 py-5 rounded rounded-[16px] shadow  drop-shadow-2xl  m-auto  text-center`}
                  >
                    <div className="  child-header  flex items-center justify-center ">
                      <img
                        className="w-[12%] mt-3 me-3"
                        src={val.icon}
                        alt=""
                      />
                      <h1 className="text-primaryLight font-semibold text-4xl">
                        {val.title}
                      </h1>
                    </div>
                    <div className="child-body">
                      <p className="text-primaryDark80 py-2.5 font-semibold text-lg">
                        {val.description}
                      </p>
                    </div>
                  </div>
                </>
              );
            })}
          </div>

          {/* Compassion - centered below */}
          <div className="flex justify-center mt-12">
            <div
              className={` ${styles.card} child sm:w-[80%] md:w-[80%] lg:w-[80%] xl:w-[40%]  px-10 py-5 rounded rounded-[16px] shadow drop-shadow-2xl  m-auto  text-center`}
            >
              <div className="  child-header  flex items-center justify-center ">
                <img className="w-[12%] mt-3 me-3" src={icon5} alt="" />
                <h1 className="text-primaryLight font-semibold text-4xl">
                  Compassion
                </h1>
              </div>
              <div className="child-body">
                <p className="text-primaryDark80 py-2.5 font-semibold text-lg">
                  We believe in human-centered care, supporting patients with
                  empathy and understanding while making every interaction feel
                  respectful and reassuring.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="about-us my-[100px]">
          <h1 className="text-primaryLight font-bold text-[52.19px] pb-[30px] text-center">
            About Us
          </h1>

          <div className="about-content  w-[90%] m-auto  xl:flex justify-center align-center flex-nowrap">
            <div className="about-img    xl:w-6/12">
              <img
                className="hover:-translate-y-6 transition-all duration-300 ease-in-out m-auto"
                src={aboutImg}
                alt=""
              />
            </div>

            <div className="about-text px-[20px] py-[20px]    xl:w-6/12">
              <div className="text-center xl:text-left w-full max-w-[800px] mx-auto px-4">
                <p className="text-primaryDark text-4xl font-bold tracking-wide">
                  MediConnect is a trusted <br /> platformcommitted to <br />{" "}
                  enhancing your healthcare <br /> experience with innovative{" "}
                  <br /> solutions.
                </p>

                <p className="text-primaryDark80 py-2.5 font-semibold text-xl mt-10">
                  MediConnect simplifies healthcare access by <br /> connecting
                  patients with hospitals, clinics, and <br /> doctors. We
                  provide real-time updates, easy <br /> appointment booking,
                  and personalized <br /> recommendations through innovative
                  <br /> technology.
                  <span className="text-primaryLight">
                    Your health is our priority.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
