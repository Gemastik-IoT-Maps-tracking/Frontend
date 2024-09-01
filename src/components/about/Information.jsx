import React, { useState } from "react";

function Information() {
  const [activeTab, setActiveTab] = useState("about");

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <ul className="flex justify-center mb-4 border-b">
        <li className="mr-2">
          <button
            onClick={() => handleTabClick("about")}
            className={`py-2 px-4 rounded-t-lg ${activeTab === "about" ? "bg-blue-600 text-white" : "text-blue-600 bg-gray-200"}`}
          >
            Tentang Proyek
          </button>
        </li>
        <li className="mr-2">
          <button
            onClick={() => handleTabClick("member")}
            className={`py-2 px-4 rounded-t-lg ${activeTab === "member" ? "bg-blue-600 text-white" : "text-blue-600 bg-gray-200"}`}
          >
            Tentang Kami
          </button>
        </li>
      </ul>

      <div className="p-4">
        {activeTab === "about" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700">
              Website dashboard ini merupakan bagian dari IoT project "MAPS TRACKING NAVIGASI TITIK POINT LOKASI UNTUK PENANGGULANGAN PASCA BENCANA"
            </h2>
            <p className="mt-4 text-gray-600">
              Website ini berfungsi untuk menampilkan data dari alat IoT dengan data yang di terima dari MQTT.
            </p>
          </div>
        )}

        {activeTab === "member" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Project ini dibuat oleh:</h2>
            <ul className="list-disc list-inside mt-4 text-gray-600">
              <li>Naufal Maulana Al-Ghifari Irawan</li>
              <li>Ghiyats Ibnu Syahied</li>
              <li>Muhammad Hauzan Dini Fakhri</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Information;
