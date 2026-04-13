import React from 'react'

export default function Header({ imgUrl, title1, title2, description, showContent = true }) {
  return (
    <>
      <div className=" pt-[80px] header-container h-screen relative  ">
        <div className="h-full">
          <img className="w-[100%] h-full" src={imgUrl} alt="" />
        </div>

        {showContent && (
          <div className="header-content  text-left  rounded-[16px] px-[40px] py-[30px] bg-[#FFFFFF80] absolute bottom-[35%] left-[10%]   text-red">
            <div className="">
              <h1 className="text-primaryLight font-extrabold text-[52.19px] py-2.5">
                {title1}
              </h1>
              <h4 className="text-primaryDark font-bold text-3xl">{title2}</h4>
              <p className="whitespace-pre-line text-primaryDark80 py-2.5 font-semibold text-lg">
                {description}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
