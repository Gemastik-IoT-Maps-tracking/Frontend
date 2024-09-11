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
    this.mapRef = createRef();
  }

  state = {
    data: {
      all_devices: [],
      visited_devices: []
    },
    loading: true,
  };

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          this.fetchData(latitude, longitude);
        },
        error => {
          console.error("Error fetching device location:", error);
          this.setState({ loading: false });
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      this.setState({ loading: false });
    }
  }

  fetchData(lat, lon) {
    fetch(`http://localhost:5001/api/sos-path?lat=${lat}&lon=${lon}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Data from API:", data);
        this.setState({ data, loading: false });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        this.setState({ loading: false });
      });
  }

  handleMarkerClick = (lat, lng) => {
    const map = this.mapRef.current;
    if (map != null) {
      map.setView([lat, lng], 18);
    }
  };

  warnaMarker = (status, name) => {
    if (name && name.includes("Markas")) {
      return "black";
    }

    switch (status) {
      case 'SOS':
        return 'red';
      case 'Aman':
        return 'green';
      case 'Warning':
        return 'gold';
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
      [-10.0, 95.0],
      [6.0, 141.0]
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
            attribution="&copy; <a>OpenstreetMap. GEMASTIK XVII Piranti Cerdas-'Mulai Aja Dulu'</a>" 
          />
          
          <ZoomControl position="bottomright" />

          {/* Render Semua Marker */}
          {data.all_devices.map((device, index) => (
            <Marker
              key={index}
              position={[device.Latitude, device.Longitude]}
              icon={new L.Icon({
                iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${this.warnaMarker(device.Status, device.Name)}.png`,
                iconSize: [20, 30],
              })}
              eventHandlers={{
                click: () => {
                  this.handleMarkerClick(device.Latitude, device.Longitude);
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                <span className="text-sm text-gray-700">
                  {device.Name === "Markas"
                    ? "Markas" 
                    : (
                      <>
                        Time: {device.Time}
                        <br />
                        Name: {device.Name}
                        <br />
                        Status: {device.Status}
                      </>
                    )}
                </span>
              </Tooltip>
            </Marker>
          ))}

          {/* Render Polylines */}
          {data.visited_devices.map((visited, index) => (
            <Polyline
              key={index}
              positions={visited.path}
              color={visited.color}
            />
          ))}
        </MapContainer>
      </div>
    );
  }
}

export default SOSComponent;