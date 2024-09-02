import React, { useEffect, useState } from 'react';
import Sidebar from "/src/components/Sidebar";
import Legenda from "/src/components/main/Legenda";
import SOSComponent from '../components/sos/sosComponent';


function App() {
  const [data] = useState([]);

  const groupedData = {};
  data.forEach(titik => {
    if (!groupedData[titik.Name]) {
      groupedData[titik.Name] = [];
    }
    groupedData[titik.Name].push([titik.Lattitude, titik.Longitude]);
  });

  const warnaMarker = (status) => {
    switch (status) {
      case "SOS":
        return "red";
      case "WARNING":
        return "gold";
      case "AMAN":
        return "green";
      default:
        return "blue";
    }
  };

  return (
    <>
      <div className='flex h-screen w-screen bg-gray-100'>
        <Sidebar />
        <div className="z-10 h-auto w-full">
          <SOSComponent data={data} groupedData={groupedData} warnaMarker={warnaMarker} />
        </div>
        <Legenda />
      </div>
    </>
  );
}

export default App;