import requests
import json
from flask import Flask, jsonify
from flask_cors import CORS
from googletrans import Translator
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

translator = Translator()  # Initialize the Google Translate API

def get_earthquake_data(min_magnitude=1.0, min_longitude=92, max_longitude=101, min_latitude=9, max_latitude=29):
    """Fetches earthquake data from USGS."""
    # Get the current date and time
    now = datetime.utcnow()
    # Set the start time to 1 day ago (or adjust as needed)
    start_time = (now - timedelta(days=1)).strftime("%Y-%m-%dT%H:%M:%S")
    # Format the current time
    end_time = now.strftime("%Y-%m-%dT%H:%M:%S")

    url = (
        f"https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson"
        f"&starttime={start_time}&endtime={end_time}"
        f"&minmagnitude={min_magnitude}&minlongitude={min_longitude}"
        f"&maxlongitude={max_longitude}&minlatitude={min_latitude}&maxlatitude={max_latitude}"
    )
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return data["features"]
    else:
        print(f"Error fetching data: {response.status_code}")
        return None

def translate_to_myanmar(text):
    """Temporarily bypass translation for debugging."""
    return text

@app.route('/api/earthquakes', methods=['GET'])
def get_myanmar_earthquakes():
    """API endpoint to get earthquake data for Myanmar."""
    earthquakes = get_earthquake_data()
    if earthquakes:
        filtered_data = [
            {
                "magnitude": eq["properties"]["mag"],
                "place": translate_to_myanmar(eq["properties"]["place"]),
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