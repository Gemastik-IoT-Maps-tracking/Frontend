import React, { Component } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Polyline, Tooltip, TileLayer } from 'react-leaflet';
import L from 'leaflet';

class MapComponent extends Component {
  state = {
    data: {
      all_devices: [],
      visited_devices: []
    },
    loading: true,
  };

  componentDidMount() {
    fetch('http://localhost:5000/api/get-path')
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Debug data from API
        this.setState({ data, loading: false });
      });
  }

  render() {
    const { data, loading } = this.state;

    if (loading) {
      return <p>Loading...</p>;
    }

    const warnaMarker = (status) => {
      switch (status) {
        case 'SOS':
          return 'red';
        case 'AMAN':
          return 'green';
        case 'WARNING':
          return 'orange';
        case 'PENDING':
          return 'black';
        default:
          return 'blue';
      }
    };

    return (
      <div style={{ position: 'relative' }}>
        <MapContainer center={[-7.0503, 110.4091]} zoom={15} className='' style={{ height: '100vh', width: '100%' }}>
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors" 
          />

          {/* Render all devices */}
          {data.all_devices.map((device, index) => (
            <Marker
              key={index}
              position={[device.Lattitude, device.Longitude]}
              icon={new L.Icon({
                iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${warnaMarker(device.Status)}.png`,
                iconSize: [25, 41],
              })}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                <span>
                  Device : {device.Name}
                  <br />
                  Status : {device.Status}
                </span>
              </Tooltip>
            </Marker>
          ))}

          {/* Render paths */}
          {data.visited_devices.map((visited, index) => (
            <Polyline
              key={index}
              positions={visited.path}
              color="black"
            />
          ))}
        </MapContainer>

        {/* List of visited devices */}
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '15px',
          borderRadius: '10px',
          boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
          maxWidth: '300px',
          maxHeight: '300px',
          overflowY: 'auto',
          zIndex: 999,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: '#333'
        }}>
          <h4 style={{
            fontSize: '18px',
            marginBottom: '10px',
            textAlign: 'center',
            color: '#333',
            borderBottom: '2px solid #ddd',
            paddingBottom: '5px',
          }}>Visited Devices</h4>
          <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
            {data.visited_devices.map((visited, index) => (
              <li key={index} style={{
                padding: '8px',
                marginBottom: '5px',
                backgroundColor: index % 2 === 0 ? '#f7f7f7' : '#e9e9e9',
                borderRadius: '5px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px',
              }}>
                <span>{index + 1}. {visited.device.Name}</span>
                <span style={{
                  fontWeight: 'bold',
                  color: warnaMarker(visited.device.Status),
                }}>
                  {visited.device.Status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default MapComponent;
