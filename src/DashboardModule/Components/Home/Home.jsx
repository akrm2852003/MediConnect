import React from "react";
import Header from "../../../SharedModule/Components/Header/Header";
import DesktopImg from "../../../assets/images/HeaderImg/Home-Header.png";
import MopileImg from "../../../assets/images/HeaderImg/Home_Header_Mopile.jpeg";
import icon1 from "../../../assets/Icons/HomeIcons/icon1.svg";
import icon2 from "../../../assets/Icons/HomeIcons/icon2.svg";
import icon3 from "../../../assets/Icons/HomeIcons/icon3.svg";
import icon4 from "../../../assets/Icons/HomeIcons/icon4.svg";
import icon5 from "../../../assets/Icons/HomeIcons/icon5.svg";
import aboutImg from "../../../assets/images/HomeImg/aboutImg.png";
import styles from "./Home.module.css";
import { useTranslation } from "react-i18next";
import useScreenSize from "../../../CustomHooks/UserScreenSize/UserScreenSize";

export default function Home() {
    const { isMobileOrTablet } = useScreenSize();
  const { t } = useTranslation();

  const values = [
    {
      title: t("accessibility"),
      description: t("accessibilityDesc"),
      icon: icon1,
    },
    {
      title: t("privacy"),
      description: t("privacyDesc"),
      icon: icon2,
    },
    {
      title: t("reliability"),
      description: t("reliabilityDesc"),
      icon: icon3,
    },
    {
      title: t("efficiency"),
      description: t("efficiencyDesc"),
      icon: icon4,
    },
  ];

  return (
    <>
      <Header
        title1={t("homeTitle1")}
        title2={t("homeTitle2")}
        description={t("homeHeaderDesc")}
        imgUrl={isMobileOrTablet ? MopileImg : DesktopImg}
      />

      <div className="container m-auto">
        <div className="block rounded-[13px] w-[100%] m-auto my-[50px] text-white bg-primaryLight hover:bg-primaryDark text-xl font-bold py-4 py-2.5">
      
        </div>

        {/* Values */}
        <div className="our-values">
          <h1 className="text-primaryLight font-bold text-[52.19px] pb-[30px] text-center">
            {t("ourValues")}
          </h1>

          <div className="our-values-childs grid gap-y-12 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2">
            {values.map((val, i) => (
              <div
                key={i}
                className={`${styles.card} child w-[80%] px-10 py-5 rounded-[16px] shadow drop-shadow-2xl m-auto text-center`}
              >
                <div className="child-header flex items-center justify-center">
                  <img className="w-[12%] mt-3 me-3" src={val.icon} alt="" />
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
            ))}
          </div>

          {/* Compassion */}
          <div className="flex justify-center mt-12">
            <div
              className={`${styles.card} child sm:w-[80%] md:w-[80%] lg:w-[80%] xl:w-[40%] px-10 py-5 rounded-[16px] shadow drop-shadow-2xl m-auto text-center`}
            >
              <div className="child-header flex items-center justify-center">
                <img className="w-[12%] mt-3 me-3" src={icon5} alt="" />
                <h1 className="text-primaryLight font-semibold text-4xl">
                  {t("compassion")}
                </h1>
              </div>

              <div className="child-body">
                <p className="text-primaryDark80 py-2.5 font-semibold text-lg">
                  {t("compassionDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="about-us my-[100px]">
          <h1 className="text-primaryLight font-bold text-[52.19px] pb-[30px] text-center">
            {t("aboutTitle")}
          </h1>

          <div className="about-content w-[90%] m-auto xl:flex justify-center align-center flex-nowrap">
            <div className="about-img xl:w-6/12">
              <img
                className="hover:-translate-y-6 transition-all duration-300 ease-in-out m-auto"
                src={aboutImg}
                alt=""
              />
            </div>

            <div className="about-text px-[20px] py-[20px] xl:w-6/12">
              <div className="text-center xl:text-left w-full max-w-[800px] mx-auto px-4">
                <p className="text-primaryDark text-4xl font-bold tracking-wide">
                  {t("aboutMainText")}
                </p>

                <p className="text-primaryDark80 py-2.5 font-semibold text-xl mt-10">
                  {t("aboutDesc")}
                  <span className="text-primaryLight">
                    {t("aboutHighlight")}
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
