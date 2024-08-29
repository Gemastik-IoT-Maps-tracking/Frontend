import React from "react";
import { Card } from "@material-tailwind/react";
import DefaultSidebar from "/src/components/Sidebar";
import CardView from "/src/components/report/card";
import Table from "/src/components/report/table";

function Data() {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <DefaultSidebar />
      <div className="flex-1 flex flex-col p-5">
        <div className="flex flex-col gap-5">
          <CardView />
        </div>
          <Card className="w-full h-screen bg-white rounded-lg shadow-lg">
            <Table />
          </Card>
      </div>
    </div>
  );
}

export default Data;
