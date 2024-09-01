
from flask import Flask, jsonify
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
            database="instalasi-backend"  # Use the correct database name
        )
        print("Database connection successful")
        return connection
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None

@app.route('/api/get-path', methods=['GET'])
def get_path():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch all devices from the database
    cursor.execute("SELECT ID, Time, Lattitude, Longitude, Name, Status FROM `map-tracking`")
    all_devices = cursor.fetchall()

    # Get the starting point where 'Markas' is part of the 'Name'
    query = "SELECT Lattitude, Longitude FROM `map-tracking` WHERE LOWER(TRIM(Name)) LIKE %s LIMIT 1"
    cursor.execute(query, ('%markas%',))
    start_point_row = cursor.fetchone()

    print("Start Point Row:", start_point_row)

    if start_point_row:
        start_point = (start_point_row[0], start_point_row[1])
    else:
        start_point = (-7.0503, 110.4091)  # Fallback if not found
    
    sos_devices = [device for device in all_devices if device[5] == "SOS"]

    G = ox.graph_from_point(start_point, dist=2000, network_type='all')

    def get_nearest_node(graph, point):
        return ox.distance.nearest_nodes(graph, point[1], point[0])

    def find_path(graph, start, end):
        start_node = get_nearest_node(graph, start)
        end_node = get_nearest_node(graph, end)
        try:
            return nx.astar_path(graph, start_node, end_node, heuristic=lambda u, v: geodesic((graph.nodes[u]['y'], graph.nodes[u]['x']), (graph.nodes[v]['y'], graph.nodes[v]['x'])).m, weight='length')
        except nx.NetworkXNoPath:
            return [start_node, end_node]

    path_colors = ["red", "blue", "green", "orange", "purple"]
    device_color_map = {}  # Maps device names to colors
    
    visited_devices = []
    for device in sos_devices:
        if device[4] not in device_color_map:
            device_color_map[device[4]] = path_colors[len(device_color_map) % len(path_colors)]
        
        path = find_path(G, start_point, (device[2], device[3]))
        if path:
            visited_devices.append({
                "device": device,
                "path": path,
                "color": device_color_map[device[4]]
            })

    response_data = {
        "all_devices": [
            {
                "ID": device[0],
                "Time": device[1],
                "Lattitude": device[2],
                "Longitude": device[3],
                "Name": device[4],
                "Status": device[5]
            }
            for device in all_devices
        ],
        "visited_devices": [
            {
                "device": {
                    "ID": item["device"][0],
                    "Time": item["device"][1],
                    "Lattitude": item["device"][2],
                    "Longitude": item["device"][3],
                    "Name": item["device"][4],
                    "Status": item["device"][5]
                },
                "path": [(G.nodes[node]['y'], G.nodes[node]['x']) for node in item["path"]],
                "color": item["color"]
            }
            for item in visited_devices
        ],
        "start_point": start_point
    }

    cursor.close()
    conn.close()

    return jsonify(response_data)

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True)

