import requests
import json
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def get_earthquake_data(min_magnitude=1.0, min_longitude=92, max_longitude=101, min_latitude=9, max_latitude=29):
    """Fetches earthquake data from USGS."""
    url = f"https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude={min_magnitude}&minlongitude={min_longitude}&maxlongitude={max_longitude}&minlatitude={min_latitude}&maxlatitude={max_latitude}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return data["features"]
    else:
        print(f"Error fetching data: {response.status_code}")
        return None

@app.route('/api/earthquakes', methods=['GET'])
def get_myanmar_earthquakes():
    """API endpoint to get earthquake data for Myanmar."""
    earthquakes = get_earthquake_data()
    if earthquakes:
        filtered_data = [
            {
                "magnitude": eq["properties"]["mag"],
                "place": eq["properties"]["place"],
                "time": eq["properties"]["time"],
                "longitude": eq["geometry"]["coordinates"][0],
                "latitude": eq["geometry"]["coordinates"][1],
            }
            for eq in earthquakes
        ]
        return jsonify(filtered_data)
    else:
        return jsonify({"error": "Unable to fetch earthquake data"}), 500

if __name__ == '__main__':
    app.run(debug=True)