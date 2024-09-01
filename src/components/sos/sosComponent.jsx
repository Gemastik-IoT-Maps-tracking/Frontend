import React, { Component, createRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Polyline, Tooltip, TileLayer, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import localforage from 'localforage';
import Loading from '../sos/loading';

localforage.config({
  name: 'map-tile-cache'
});

class CachedTileLayer extends Component {
  createTile = (coords, done) => {
    const tile = document.createElement('img');

    const url = this.props.url.replace('{s}', 'a')
                              .replace('{z}', coords.z)
                              .replace('{x}', coords.x)
                              .replace('{y}', coords.y);

    localforage.getItem(url).then((data) => {
      if (data) {
        tile.src = data;
      } else {
        tile.src = url;
        tile.crossOrigin = 'Anonymous';
        tile.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = tile.naturalWidth;
          canvas.height = tile.naturalHeight;
          const context = canvas.getContext('2d');
          context.drawImage(tile, 0, 0);
          const base64Url = canvas.toDataURL('image/png');

          localforage.setItem(url, base64Url);
        };
      }
      done(null, tile);
    }).catch(() => {
      tile.src = url;
      done(null, tile);
    });

    return tile;
  };

  render() {
    return (
      <TileLayer
        {...this.props}
        tileSize={256}
        createTile={this.createTile}
      />
    );
  }
}

class SOSComponent extends Component {
  constructor(props) {
    super(props);
    this.mapRef = createRef();  // Membuat referensi peta
  }

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
        console.log(data);
        this.setState({ data, loading: false });
      });
  }

  handleMarkerClick = (lat, lng) => {
    const map = this.mapRef.current;
    if (map != null) {
      map.setView([lat, lng], 18); // Zoom ke lokasi marker
    }
  };

  // Modifikasi fungsi warnaMarker untuk menerima dua parameter: status dan name
  warnaMarker = (status, name) => {
    if (name && name.includes("Markas")) {
      return "black";
    }

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

  render() {
    const { data, loading } = this.state;

    if (loading) {
      return <Loading />;
    }

    const batasIndonesia = [
      [-10.0, 95.0],  // Pulau Barat (Sumatera)
      [6.0, 141.0]    // Pulau Timur (Papua)
    ];

    return (
      <div style={{ position: 'relative' }}>
        <MapContainer 
          ref={this.mapRef} 
          bounds={batasIndonesia} 
          maxBounds={batasIndonesia}
          maxBoundsViscosity={1.0}
          zoom={5}
          minZoom={5} 
          zoomControl={false} 
          style={{ height: '100vh', width: '100%' }}>
          
          <CachedTileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            attribution="&copy; <a>GEMASTIK XVII Piranti Cerdas-'Mulai Aja Dulu'</a>" 
          />
          
          <ZoomControl position="bottomright" />

          {data.all_devices.map((device, index) => (
            <Marker
              key={index}
              position={[device.Lattitude, device.Longitude]}
              icon={new L.Icon({
                iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${this.warnaMarker(device.Status, device.Name)}.png`,
                iconSize: [20, 30],
              })}
              eventHandlers={{
                click: () => {
                  this.handleMarkerClick(device.Lattitude, device.Longitude);
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                <span className="text-sm text-gray-700">
                  Time: {device.Time}
                  <br />
                  Name: {device.Name}
                  <br />
                  Status: {device.Status}
                </span>
              </Tooltip>
            </Marker>
          ))}

          {data.visited_devices.map((visited, index) => (
              <Polyline
                  key={index}
                  positions={visited.path}
                  color={visited.color}  // Menggunakan warna yang disediakan oleh backend
              />
          ))}
        </MapContainer>

        <div className="fixed bottom-5 right-5 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg max-w-xs max-h-72 overflow-y-auto z-[1000] font-sans text-gray-800">
          <h4 className="text-lg mb-2 text-center text-gray-800 border-b-2 border-gray-300 pb-1">
            Visited Devices
          </h4>
          <ul className="list-none p-0 m-0">
            {data.visited_devices.map((visited, index) => (
              <li
                key={index}
                className={`p-2 mb-1 rounded-md flex justify-between items-center text-sm ${index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-300'}`}
              >
                <span>{index + 1}. {visited.device.Name}</span>
                <span className={`font-bold text-${this.warnaMarker(visited.device.Status)}`}>
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

export default SOSComponent;
