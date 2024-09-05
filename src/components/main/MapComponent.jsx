import React, { Component, createRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Polyline, Tooltip, TileLayer, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import localforage from 'localforage';
import Loading from '../sos/loading';

// Konfigurasi caching untuk tile map
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

class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],       // Semua data perangkat
      paths: [],      // Data jalur berdasarkan nama perangkat
      loading: true   // Tambahkan state loading
    };
    this.mapRef = createRef();
  }

  componentDidMount() {
    this.getDeviceLocation(); // Dapatkan lokasi perangkat saat komponen pertama kali di-mount
  }

  getDeviceLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.fetchMapData, this.handleLocationError);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  handleLocationError = (error) => {
    console.error("Error fetching device location:", error);
    this.setState({ loading: false });
  };

  fetchMapData = async (position) => {
    const { latitude, longitude } = position.coords;

    try {
      const response = await fetch(`http://localhost:5000/api/home-path?lat=${latitude}&lon=${longitude}`);
      const responseData = await response.json();

      // Log data respons untuk debug
      console.log('Response Data:', responseData);

      this.setState({
        data: responseData.all_devices,
        paths: responseData.visited_devices,
        loading: false
      });

      // Log untuk memastikan state ter-update dengan benar
      console.log('Paths:', responseData.visited_devices);
      console.log('Data:', responseData.all_devices);

    } catch (error) {
      console.error('Error fetching data:', error);
      this.setState({ loading: false });  // Tetap set loading ke false jika ada error
    }
  };

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
        return 'gold';
      default:
        return 'blue';
    }
  };

  handleMarkerClick = (lat, lng) => {
    const map = this.mapRef.current;
    if (map != null) {
      map.setView([lat, lng], 18);  // Zoom ke lokasi marker saat diklik
    }
  };

  render() {
    const { data, paths, loading } = this.state;

    const batasIndonesia = [
      [-10.0, 95.0],  
      [6.0, 141.0]    
    ];

    if (loading) {
      return <Loading />;  // Tampilkan komponen loading saat state loading true
    }

    return (
      <MapContainer 
        bounds={batasIndonesia} 
        maxBounds={batasIndonesia}
        maxBoundsViscosity={1.0}
        zoom={5}
        minZoom={5} 
        zoomControl={false}
        className='rounded-lg shadow-lg'
        style={{ height: "100vh", width: "100%" }}
        ref={this.mapRef}
      >
        <CachedTileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution="&copy; <a>GEMASTIK XVII Piranti Cerdas-'Mulai Aja Dulu'</a>" 
        />
        
        <ZoomControl position="bottomright" />

        {/* Render Polylines */}
        {paths && paths.map((path, index) => (
          <Polyline key={index} positions={path.path} color={path.color} />
        ))}

        {/* Render Markers */}
        {data && data.map(titik => (
          <Marker
            key={titik.ID || titik.Name}  // Gunakan Name sebagai key jika ID tidak ada (untuk Markas)
            position={[titik.Lattitude, titik.Longitude]}
            icon={new L.Icon({
              iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${this.warnaMarker(titik.Status, titik.Name)}.png`,
              iconSize: [20, 30],
            })}
            eventHandlers={{
              click: () => {
                this.handleMarkerClick(titik.Lattitude, titik.Longitude);
              },
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false} className="custom-tooltip">
              <span className="text-sm text-gray-700">
                {titik.Name === "Markas" 
                  ? "Markas" 
                  : (
                    <>
                      Data ke-{titik.ID}, Waktu: {titik.Time}
                      <br />
                      Alat: {titik.Name}, Status: {titik.Status}
                      <br />
                      Catatan: {titik.Catatan}
                    </>
                  )
                }
              </span>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    );
  }
}

export default MapComponent;
