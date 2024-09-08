import React, { Component, createRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Polyline, Tooltip, TileLayer, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import localforage from 'localforage';
import Loading from '../sos/loading';  // Impor komponen Loading

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

class MapAllComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userPosition: null,
      loading: true,
      error: null
    };
    this.mapRef = createRef();
  }

  componentDidMount() {
    this.getDeviceLocation();
  }

  getDeviceLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.handleGeolocationSuccess,
        this.handleGeolocationError
      );
    } else {
      this.setState({ error: "Geolocation is not supported by this browser." });
    }
  };

  handleGeolocationSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    this.setState({
      userPosition: [latitude, longitude],
      loading: false  // Set loading ke false ketika geolokasi berhasil diambil
    });
  };

  handleGeolocationError = (error) => {
    console.error("Error fetching device location:", error);
    this.setState({ error: error.message, loading: false });
  };

  handleMarkerClick = (lat, lng) => {
    const map = this.mapRef.current;
    if (map) {
      map.setView([lat, lng], 18);
    }
  };

  render() {
    const { data, groupedData, warnaMarker } = this.props;
    const { userPosition, loading, error } = this.state;

    // Gunakan komponen Loading saat masih loading
    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    // Batas wilayah Indonesia
    const batasIndonesia = [
      [-10.0, 95.0],  // Barat daya (SW)
      [6.0, 141.0]    // Timur laut (NE)
    ];

    return (
      <MapContainer
        center={userPosition || [-6.354881750178463, 106.84146110607826]}  // Jika geolokasi ada, gunakan
        zoom={5}  // Disetel menjadi 5 agar seluruh wilayah Indonesia terlihat
        minZoom={5}  // Zoom minimum untuk peta
        maxZoom={18}  // Zoom maksimum
        zoomControl={false}
        maxBounds={batasIndonesia}   // Batas peta Indonesia
        maxBoundsViscosity={1.0}     // Viskositas peta (mencegah keluar dari batas)
        scrollWheelZoom={true}       // Aktifkan zoom menggunakan scroll
        dragging={true}              // Aktifkan dragging
        className='rounded-lg shadow-lg'
        style={{ height: "100vh", width: "100%" }}
        ref={this.mapRef}
      >
        <CachedTileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution="&copy; <a>OpenstreetMap. GEMASTIK XVII Piranti Cerdas-'Mulai Aja Dulu'</a>" 
        />

        <ZoomControl position="bottomright" />

        {Object.entries(groupedData).map(([name, polylinePoints], index) => (
          <div key={index}>
            <h2>{name}</h2>
            {polylinePoints.length > 1 && (
              <Polyline key={index} positions={polylinePoints} color="black" />
            )}

            {data
              .filter(titik => titik.Name === name)
              .map(titik => (
                <Marker
                  key={titik.id}
                  position={[titik.Latitude, titik.Longitude]}
                  icon={new L.Icon({
                    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${warnaMarker(titik.Status)}.png`,
                    iconSize: [20, 30],
                  })}
                  eventHandlers={{
                    click: () => this.handleMarkerClick(titik.Latitude, titik.Longitude)
                  }}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false} className="custom-tooltip">
                    <span>
                      Data ke-{titik.ID}
                      <br />
                      Alat : {titik.Name}
                      <br />
                      Status : {titik.Status}
                      <br />
                      Catatan : {titik.Catatan}
                    </span>
                  </Tooltip>
                </Marker>
              ))}
          </div>
        ))}
      </MapContainer>
    );
  }
}

export default MapAllComponent;
