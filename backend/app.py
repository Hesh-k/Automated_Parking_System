from flask import Flask
from flask_cors import CORS  # Import CORS
from services.number_plate_service import cleanup
from routes.number_plate_routes import number_plate_blueprint
import atexit

app = Flask(__name__)

# Enable CORS for all routes, allowing requests from any origin (adjust as needed)
CORS(app)

# Register the number plate blueprint
app.register_blueprint(number_plate_blueprint, url_prefix='/api')

# Cleanup webcam on server shutdown
def shutdown():
    print("Shutting down Flask app, releasing webcam...")
    cleanup()

atexit.register(shutdown)  # Call cleanup when the Python process exits

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)  # Debug=False to avoid app context issues