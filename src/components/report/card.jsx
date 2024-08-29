import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CardView() {
  const [DataAman, setDataAman] = useState(0);
  const [DataWarning, setDataWarning] = useState(0);
  const [DataSOS, setDataSOS] = useState(0);
  const [DataNull, setDataNull] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.get('http://localhost:8080/status/aman');
        setDataAman(response1.data[0]?.Jumlah_Device_Aman || 0);
        
        const response2 = await axios.get('http://localhost:8080/status/warning');
        setDataWarning(response2.data[0]?.Jumlah_Device_Warning || 0);

        const response3 = await axios.get('http://localhost:8080/status/SOS');
        setDataSOS(response3.data[0]?.Jumlah_Device_SOS || 0);

        const response4 = await axios.get('http://localhost:8080/status/noStatus');
        setDataNull(response4.data[0]?.Jumlah_Device_noStatus || 0);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-5 mb-2">
      <div className="flex flex-col items-center p-4 bg-green-600 rounded-lg shadow-md text-white w-32 text-center">
        <h3 className="text-sm font-semibold mb-2">Aman</h3>
        <p className="text-lg font-bold">{DataAman}</p>
      </div>
      <div className="flex flex-col items-center p-4 bg-yellow-600 rounded-lg shadow-md text-white w-32 text-center">
        <h3 className="text-sm font-semibold mb-2">Warning</h3>
        <p className="text-lg font-bold">{DataWarning}</p>
      </div>
      <div className="flex flex-col items-center p-4 bg-red-600 rounded-lg shadow-md text-white w-32 text-center">
        <h3 className="text-sm font-semibold mb-2">SOS</h3>
        <p className="text-lg font-bold">{DataSOS}</p>
      </div>
      <div className="flex flex-col items-center p-4 bg-blue-600 rounded-lg shadow-md text-white w-32 text-center">
        <h3 className="text-sm font-semibold mb-2">Tanpa Status</h3>
        <p className="text-lg font-bold">{DataNull}</p>
      </div>
    </div>
  );
}

export default CardView;
