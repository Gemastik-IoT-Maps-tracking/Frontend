import React, { Component, createRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Polyline, Tooltip, TileLayer, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import localforage from 'localforage';

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
    this.mapRef = createRef();
  }

  // Tambahkan fungsi warnaMarker untuk menerima dua parameter: status dan name
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

  handleMarkerClick = (lat, lng) => {
    const map = this.mapRef.current;
    if (map != null) {
      map.setView([lat, lng], 18);  // Zoom ke lokasi marker
    }
  };

  render() {
    const { data, groupedData } = this.props;

    // Batas wilayah negara Indonesia
    const batasIndonesia = [
      [-10.0, 95.0],  // Pulau Barat (Sumatera)
      [6.0, 141.0]    // Pulau Timur (Papua)
    ];

    return (
      <MapContainer 
        bounds={batasIndonesia} 
        maxBounds={batasIndonesia}
        maxBoundsViscosity={1.0}
        zoom={5}
        minZoom={5} // Max zoom out
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
                      Data ke-{titik.ID},Waktu {titik.Time}
                      <br />
                      Alat : {titik.Name},Status : {titik.Status}
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

export default MapComponent;
