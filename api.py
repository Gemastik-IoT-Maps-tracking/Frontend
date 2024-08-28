from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
import osmnx as ox
import networkx as nx
from geopy.distance import geodesic

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="map-tracking"
    )

@app.route('/api/get-path', methods=['GET'])
def get_path():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Ambil data semua perangkat
    cursor.execute("SELECT ID, Lattitude, Longitude, Name, Status FROM `map-tracking`")
    all_devices = cursor.fetchall()

    # Filter perangkat dengan status SOS
    sos_devices = [device for device in all_devices if device[4] == "SOS"]

    # Titik awal di Kampus UNNES (Koordinat UNNES: -7.0503, 110.4091)
    start_point = (-7.0503, 110.4091)

    # Download peta jalan sekitar UNNES dengan jarak yang lebih besar
    G = ox.graph_from_point(start_point, dist=5000, network_type='drive')

    # Fungsi untuk mendapatkan node terdekat di graf dari suatu titik
    def get_nearest_node(graph, point):
        return ox.distance.nearest_nodes(graph, point[1], point[0])

    # Menemukan jalur menggunakan A* dengan fallback ke rute Euclidean jika tidak ditemukan
    def find_path(graph, start, end):
        start_node = get_nearest_node(graph, start)
        end_node = get_nearest_node(graph, end)
        try:
            return nx.astar_path(graph, start_node, end_node, heuristic=lambda u, v: geodesic((graph.nodes[u]['y'], graph.nodes[u]['x']), (graph.nodes[v]['y'], graph.nodes[v]['x'])).m, weight='length')
        except nx.NetworkXNoPath:
            # Jika tidak ditemukan path, kembalikan garis lurus antara dua titik
            return [start_node, end_node]

    # Algoritma Greedy untuk menentukan urutan perangkat yang dikunjungi
    visited_devices = []
    current_point = start_point

    while sos_devices:
        closest_device = min(sos_devices, key=lambda x: geodesic(current_point, (x[1], x[2])).m)
        path = find_path(G, current_point, (closest_device[1], closest_device[2]))
        if path:
            visited_devices.append((closest_device, path))
            current_point = (closest_device[1], closest_device[2])
            sos_devices.remove(closest_device)

    # Data yang akan dikirim ke ReactJS
    response_data = {
        "all_devices": [
            {
                "ID": device[0],
                "Lattitude": device[1],
                "Longitude": device[2],
                "Name": device[3],
                "Status": device[4]
            }
            for device in all_devices
        ],
        "visited_devices": [
            {
                "device": {
                    "ID": device[0],
                    "Lattitude": device[1],
                    "Longitude": device[2],
                    "Name": device[3],
                    "Status": device[4]
                },
                "path": [(G.nodes[node]['y'], G.nodes[node]['x']) for node in path]
            }
            for device, path in visited_devices
        ]
    }

    cursor.close()
    conn.close()

    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True)
