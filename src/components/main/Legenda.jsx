import React from 'react';

class Legenda extends React.Component {
  render() {
    return (
      <div className="absolute top-6 right-6 z-50 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Legenda</h2>
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="w-4 h-4 mr-3 rounded-full bg-red-600"></div>
            <span className="text-gray-600">SOS</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 mr-3 rounded-full bg-yellow-600"></div>
            <span className="text-gray-600">Warning</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 mr-3 rounded-full bg-green-600"></div>
            <span className="text-gray-600">Aman</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 mr-3 rounded-full bg-blue-600"></div>
            <span className="text-gray-600">Tanpa Status</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 mr-3 rounded-full bg-black"></div>
            <span className="text-gray-600">Markas</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Legenda;
