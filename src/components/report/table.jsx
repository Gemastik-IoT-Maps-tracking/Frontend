import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { DocumentIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';

function Table() {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCatatanModal, setShowCatatanModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [newCatatan, setNewCatatan] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/data/getAll');
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    setShowDeleteConfirmation(true);
    setDeleteItemId(id);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/data/delete`, {
        params: {
          id: deleteItemId,
        },
      });
      const updatedData = data.filter((item) => item.ID !== deleteItemId);
      setData(updatedData);
      setShowDeleteConfirmation(false);
      setDeleteItemId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDeleteItemId(null);
  };

  const handleUpdateStatus = async () => {
    try {
      await axios.put(`http://localhost:8080/data/updateStatus/${selectedItem.ID}`, {
        status: newStatus,
      });
      const updatedData = data.map((item) =>
        item.ID === selectedItem.ID ? { ...item, Status: newStatus } : item
      );
      setData(updatedData);
      closeStatusModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCatatan = async () => {
    try {
      await axios.put(`http://localhost:8080/data/updateCatatan/${selectedItem.ID}`, {
        catatan: newCatatan,
      });
      const updatedData = data.map((item) =>
        item.ID === selectedItem.ID ? { ...item, Catatan: newCatatan } : item
      );
      setData(updatedData);
      closeCatatanModal();
    } catch (error) {
      console.error(error);
    }
  };

  const openStatusModal = (item) => {
    setSelectedItem(item);
    setNewStatus(item.Status);
    setShowStatusModal(true);
  };

  const closeStatusModal = () => {
    setSelectedItem(null);
    setNewStatus('');
    setShowStatusModal(false);
  };

  const openCatatanModal = (item) => {
    setSelectedItem(item);
    setNewCatatan(item.Catatan || '');
    setShowCatatanModal(true);
  };

  const closeCatatanModal = () => {
    setSelectedItem(null);
    setNewCatatan('');
    setShowCatatanModal(false);
  };

  const columns = [
    {
      name: 'ID',
      selector: row => row.ID,
      sortable: true,
      width: '10%',
      cell: row => <span className="font-semibold text-gray-700">{row.ID}</span>,
    },
    {
      name: 'Time',
      selector: row => row.Time,
      sortable: false,
      width: '15%',
      cell: row => <span className="text-gray-600">{row.Time}</span>,
    },
    {
      name: 'Name',
      selector: row => row.Name,
      sortable: false,
      width: '10%',
      cell: row => <span className="text-gray-600">{row.Name}</span>,
    },
    {
      name: 'Latitude',
      selector: row => row.Latitude,
      sortable: false,
      width: '10%',
      cell: row => <span className="text-gray-600">{row.Latitude}</span>,
    },
    {
      name: 'Longitude',
      selector: row => row.Longitude,
      sortable: false,
      width: '10%',
      cell: row => <span className="text-gray-600">{row.Longitude}</span>,
    },
    {
      name: 'Status',
      selector: row => row.Status,
      sortable: false,
      width: '15%',
      cell: row => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            row.Status === 'Aman' ? 'bg-green-100 text-green-800' :
            row.Status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
            row.Status === 'SOS' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}
        >
          {row.Status || 'Tanpa Status'}
        </span>
      ),
    },
    {
      name: 'Catatan',
      selector: row => row.Catatan,
      sortable: false,
      cell: row => <div style={{ maxHeight: '100px', overflowY: 'auto' }} className="text-gray-600">{row.Catatan}</div>,
      width: '20%',
    },
    {
      name: 'Action',
      button: true,
      cell: row => (
        <div className="flex space-x-2">
          <button onClick={() => openStatusModal(row)} className="hover:scale-105 transform transition-transform">
            <PencilSquareIcon className="h-7 w-7 p-1 bg-blue-600 text-white rounded-md hover:bg-blue-400" />
          </button>
          <button onClick={() => openCatatanModal(row)} className="hover:scale-105 transform transition-transform">
            <DocumentIcon className="h-7 w-7 p-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-400" />
          </button>
          <button onClick={() => handleDelete(row.ID)} className="hover:scale-105 transform transition-transform">
            <TrashIcon className="h-7 w-7 p-1 bg-red-600 text-white rounded-md hover:bg-red-400" />
          </button>
        </div>
      ),
      width: '10%',
    },
  ];

  return (
    <div className="table-container mx-auto w-full overflow-x-auto">
      <div className="data-table-container rounded-lg shadow-lg bg-white p-4" style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <DataTable
          columns={columns}
          data={data}
          pagination
          responsive
          className="data-table w-full h-full text-gray-700"
        />
      </div>

      {showStatusModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-md shadow-lg max-w-sm w-full">
            <label className="block mb-2 text-lg font-semibold text-gray-700">Update Status</label>
            <select
              className="w-full p-2 mb-4 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value === 'null' ? null : e.target.value)}
            >
              <option value="---">Pilih Status</option>
              <option value="Aman">AMAN</option>
              <option value="Warning">Warning</option>
              <option value="SOS">SOS</option>
              <option value="null">Tanpa Status</option>
            </select>
            <button
              onClick={handleUpdateStatus}
              className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-400"
            >
              Ya
            </button>
            <button
              onClick={closeStatusModal}
              className="w-full p-2 bg-gray-400 text-white rounded-md hover:bg-gray-300 mt-2"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-md shadow-lg max-w-sm w-full">
            <p className="mb-4 text-lg font-semibold text-gray-700">
              Apakah Kamu ingin menghapus data ini?
            </p>
            <button
              onClick={confirmDelete}
              className="w-full p-2 bg-red-600 text-white rounded-md hover:bg-red-400"
            >
              Ya
            </button>
            <button
              onClick={cancelDelete}
              className="w-full p-2 bg-gray-400 text-white rounded-md hover:bg-gray-300 mt-2"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {showCatatanModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-md shadow-lg max-w-sm w-full">
            <label className="block mb-2 text-lg font-semibold text-gray-700">Update Catatan</label>
            <textarea
              className="w-full p-2 mb-4 border rounded-md focus:ring-2 focus:ring-yellow-500"
              value={newCatatan}
              onChange={(e) => setNewCatatan(e.target.value)}
            />
            <button
              onClick={handleUpdateCatatan}
              className="w-full p-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-400"
            >
              Ya
            </button>
            <button
              onClick={closeCatatanModal}
              className="w-full p-2 bg-gray-400 text-white rounded-md hover:bg-gray-300 mt-2"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
