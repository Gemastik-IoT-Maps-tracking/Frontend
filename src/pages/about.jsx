import React from "react";
import DefaultSidebar from "../component/Sidebar";
import ProfileCard from "../component/Biodata";
import Information from "../component/infoCard";

function About() {
  return (
    <>
      <div className="flex">
        <DefaultSidebar />
        <div className="flex flex-wrap justify-center ml-8 mt-[10px]">
          <ProfileCard />
          <Information />
        </div>
      </div>
    </>
  );
}

export default About;
