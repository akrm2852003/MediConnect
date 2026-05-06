import React from "react";
import useScreenSize from "../../../CustomHooks/UserScreenSize/UserScreenSize";

export default function Header({
  imgUrl,
  title1,
  title2,
  description,
  showContent = true,
}) {
  const { isMobileOrTablet } = useScreenSize();
  return (
    <>
      <div className="header-container min-h-screen">
        {/* Image */}
        <div className="relative lg:pt-[60px] mb-24">
          <img className="w-full h-full object-cover" src={imgUrl} alt="" />

          {showContent && (
           <div
  className={`header-content ${
    isMobileOrTablet
      ? "absolute left-[50%] translate-x-[-50%] bottom-[-60px] w-[90%]"
      : "absolute bottom-[35%] left-[10%]"
  } 
  rounded-[16px] 
  px-[20px] md:px-[40px] 
  py-[20px] md:py-[30px] 
  
  bg-white/40 
  backdrop-blur-md 
  border border-white/30 
  shadow-2xl`}
>
              <h1 className="text-primaryLight font-extrabold text-3xl md:text-[52px] py-2">
                {title1}
              </h1>

              <h4 className="text-primaryDark font-bold text-xl md:text-3xl">
                {title2}
              </h4>

              <p className="whitespace-pre-line text-primaryDark80 py-2 font-semibold text-sm md:text-lg">
                {description}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
