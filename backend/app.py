from flask import Flask, jsonify
from flask_cors import CORS
from services.number_plate_service import cleanup as number_plate_cleanup
from services.vision_service import cleanup as parking_cleanup
from routes.number_plate_routes import number_plate_blueprint
from routes.parking_routes import parking_blueprint
import atexit
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(filename='app.log', level=logging.ERROR, format='%(asctime)s %(levelname)s: %(message)s')

# Enable CORS for all routes, allowing requests from any origin
CORS(app)

# Register blueprints
app.register_blueprint(number_plate_blueprint, url_prefix='/api')
app.register_blueprint(parking_blueprint, url_prefix='/api')

# Handle 404 errors
@app.errorhandler(404)
def not_found(error):
    logging.error(f"404 error: {str(error)}")
    return jsonify({"error": "Resource not found"}), 404

# Cleanup both webcams on server shutdown
def shutdown():
    print("Shutting down Flask app, releasing webcams...")
    number_plate_cleanup()
    parking_cleanup()

atexit.register(shutdown)  # Call cleanup when the Python process exits

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)  # Debug=False to avoid app context issues