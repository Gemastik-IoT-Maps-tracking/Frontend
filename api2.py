from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import osmnx as ox
import networkx as nx
from geopy.distance import geodesic

app = Flask(__name__)
CORS(app)

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="instalasi-backend"
        )
        print("Database connection successful")
        return connection
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None

@app.route('/api/sos-path', methods=['GET'])
def get_path():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Ambil lokasi dari parameter query (lokasi perangkat yang mengakses web)
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)

    if lat is not None and lon is not None:
        start_point = (lat, lon)
    else:
        start_point = (-7.0503, 110.4091)  # Lokasi default jika tidak ada koordinat

    # Ambil data perangkat dari database
    cursor.execute("SELECT ID, Time, Latitude, Longitude, Name, Status FROM `map-tracking` where latitude is not null and longitude is not null")
    all_devices = cursor.fetchall()

    # Filter perangkat dengan status SOS
    sos_devices = [device for device in all_devices if device[5] == "SOS"]

    G = ox.graph_from_point(start_point, dist=7000, network_type='all')

    def get_nearest_node(graph, point):
        return ox.distance.nearest_nodes(graph, point[1], point[0])

    def find_path(graph, start, end):
        start_node = get_nearest_node(graph, start)
        end_node = get_nearest_node(graph, end)
        try:
            return nx.astar_path(
                graph, start_node, end_node,
                heuristic=lambda u, v: geodesic((graph.nodes[u]['y'], graph.nodes[u]['x']), (graph.nodes[v]['y'], graph.nodes[v]['x'])).m,
                weight='length'
            )
        except nx.NetworkXNoPath:
            return []

    path_colors = ["red", "blue", "green", "orange", "purple"]
    device_color_map = {}
    visited_devices = []

    # Hitung jalur dari "Markas" ke setiap perangkat dengan status SOS
    for device in sos_devices:
        if device[4] not in device_color_map:
            device_color_map[device[4]] = path_colors[len(device_color_map) % len(path_colors)]
        
        path = find_path(G, start_point, (device[2], device[3]))
        if path:
            visited_devices.append({
                "device": device,
                "path": [(G.nodes[node]['y'], G.nodes[node]['x']) for node in path if node in G.nodes],  
                "color": device_color_map[device[4]]
            })

    response_data = {
        "all_devices": [
            {
                "Latitude": start_point[0],
                "Longitude": start_point[1],
                "Name": "Markas"
            }
        ] + [
            {
                "ID": device[0],
                "Time": device[1],
                "Latitude": device[2],
                "Longitude": device[3],
                "Name": device[4],
                "Status": device[5]
            }
            for device in all_devices
        ],
        "visited_devices": visited_devices,
        "start_point": start_point
    }

    cursor.close()
    conn.close()

    return jsonify(response_data)

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(port=5001,debug=True)
