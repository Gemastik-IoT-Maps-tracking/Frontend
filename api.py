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
            database="gemastik" # Gunain nama Databasenya
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
    cursor.execute("SELECT ID, Lattitude, Longitude, Name, Status FROM `map-tracking2`") # Gunain nama Table nya
    all_devices = cursor.fetchall()

    # Fetch the start point where 'awal' is part of the 'Catatan'
    query = "SELECT Lattitude, Longitude FROM `map-tracking2` WHERE LOWER(TRIM(Catatan)) LIKE %s LIMIT 1"
    cursor.execute(query, ('%awal%',))
    start_point_row = cursor.fetchone()

    # Log or print the start_point_row to verify it's being fetched correctly
    print("Start Point Row:", start_point_row)

    if start_point_row:
        start_point = (start_point_row[0], start_point_row[1])
    else:
        # Fallback if not found
        start_point = (-7.0503, 110.4091)


    # Filter devices with SOS status
    sos_devices = [device for device in all_devices if device[4] == "SOS"]

    # Download the map of roads around the start_point
    G = ox.graph_from_point(start_point, dist=7000, network_type='all')
    # Function to get the nearest node in the graph from a point
    def get_nearest_node(graph, point):
        return ox.distance.nearest_nodes(graph, point[1], point[0])

    # Find path using A* with fallback to Euclidean route if not found
    def find_path(graph, start, end):
        start_node = get_nearest_node(graph, start)
        end_node = get_nearest_node(graph, end)
        try:
            return nx.astar_path(graph, start_node, end_node, heuristic=lambda u, v: geodesic((graph.nodes[u]['y'], graph.nodes[u]['x']), (graph.nodes[v]['y'], graph.nodes[v]['x'])).m, weight='length')
        except nx.NetworkXNoPath:
            # If no path is found, return a straight line between the two points
            return [start_node, end_node]

    # Greedy algorithm to determine the order of devices to visit
    visited_devices = []
    current_point = start_point

    while sos_devices:
        closest_device = min(sos_devices, key=lambda x: geodesic(current_point, (x[1], x[2])).m)
        path = find_path(G, current_point, (closest_device[1], closest_device[2]))
        if path:
            visited_devices.append((closest_device, path))
            current_point = (closest_device[1], closest_device[2])
            sos_devices.remove(closest_device)

    # Data to be sent to ReactJS
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
        ],
        "start_point": start_point  # Include start_point for debugging
    }

    cursor.close()
    conn.close()

    return jsonify(response_data)

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True)
