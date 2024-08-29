import React from "react";
import DefaultSidebar from "/src/components/Sidebar";
import ProfileCard from "/src/components/about/Biodata";
import Information from "/src/components/about/Information";

function About() {
  return (
    <div className="flex h-screen bg-gray-100 overflow-screen">
      <DefaultSidebar />
      <div className="flex-1 flex flex-col p-5">
        <div className="flex flex-col gap-5">
          <ProfileCard />
        </div>
        <div className="flex flex-col w-full p-6 space-y-6">
          <Information />
        </div>
      </div>
    </div>
  );
}

export default About;
