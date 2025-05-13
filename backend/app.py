from flask import Flask
from flask_cors import CORS
from services.vision_service import cleanup as parking_cleanup
from routes.parking_routes import parking_blueprint
import atexit

app = Flask(__name__)

# Enable CORS for all routes, allowing requests from any origin
CORS(app)

# Register parking blueprint
app.register_blueprint(parking_blueprint, url_prefix='/api')

# Cleanup webcam on server shutdown
def shutdown():
    print("Shutting down Flask app, releasing parking webcam...")
    parking_cleanup()

atexit.register(shutdown)  # Call cleanup when the Python process exits

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)  # Debug=False to avoid app context issues