from flask import Flask, jsonify
from flask_cors import CORS
from services.number_plate_service import cleanup as number_plate_cleanup, process_frame as number_plate_process
from services.vision_service import cleanup as parking_cleanup, process_frame as parking_process
from routes.number_plate_routes import number_plate_blueprint
from routes.parking_routes import parking_blueprint
from models.parking_model import parking_model
import firebase_admin
from firebase_admin import credentials, db
import atexit
import logging
import threading
import time
from datetime import datetime

app = Flask(__name__)

# Configure logging
logging.basicConfig(filename='app.log', level=logging.ERROR, format='%(asctime)s %(levelname)s: %(message)s')

# Enable CORS for all routes
CORS(app)

# Initialize Firebase
cred = credentials.Certificate('firebase/key.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://automated-parking-system-4d615-default-rtdb.asia-southeast1.firebasedatabase.app/'
})

# Register blueprints
app.register_blueprint(number_plate_blueprint, url_prefix='/api')
app.register_blueprint(parking_blueprint, url_prefix='/api')

# Handle 404 errors
@app.errorhandler(404)
def not_found(error):
    logging.error(f"404 error: {str(error)}")
    return jsonify({"error": "Resource not found"}), 404

# Function to collect and send data to Firebase
def send_to_firebase():
    try:
        # Get number plate data
        _, detected_plate = number_plate_process()
        number_plate_data = {
            'is_detected': bool(detected_plate),
            'number_plate': detected_plate if detected_plate else None,
            'timestamp': datetime.utcnow().isoformat() if detected_plate else None
        }

        # Get parking data
        _, free_spaces, total_spaces = parking_process()
        parking_model.update_spaces(free_spaces, total_spaces)
        parking_data = {
            'free_spaces': parking_model.get_free_spaces(),
            'occupied_spaces': parking_model.get_occupied_spaces()
        }

        # Combine data
        data = {
            'number_plate': number_plate_data,
            'parking': parking_data,
            'last_updated': datetime.utcnow().isoformat()
        }

        # Send to Firebase
        ref = db.reference('parking_system')
        ref.set(data)
        logging.info("Data sent to Firebase successfully")
    except Exception as e:
        logging.error(f"Error sending data to Firebase: {e}")

# Background thread to periodically send data
def firebase_update_thread():
    while True:
        send_to_firebase()
        time.sleep(5)  # Update every 5 seconds

# Start the Firebase update thread
threading.Thread(target=firebase_update_thread, daemon=True).start()

# Cleanup both webcams on server shutdown
def shutdown():
    print("Shutting down Flask app, releasing webcams...")
    number_plate_cleanup()
    parking_cleanup()

atexit.register(shutdown)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)