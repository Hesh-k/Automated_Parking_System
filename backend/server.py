from flask import Flask
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials
from routes.parking_routes import parking_bp
from routes.discount_routes import discount_bp
from routes.vehicle_routes import vehicle_bp
import os

def create_app():
    # Creating a flask app
    app = Flask(__name__, static_folder='static')
    
    # Enable CORS and allow any network to access APIs
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Initialize Firebase Admin SDK
    cred = credentials.Certificate("firebase/key.json")
    firebase_admin.initialize_app(cred)

    # Ensure static directory exists
    os.makedirs('static/qrcodes', exist_ok=True)

    # Register blueprints
    app.register_blueprint(parking_bp, url_prefix='/api/parking_slots')
    app.register_blueprint(discount_bp, url_prefix='/api')
    app.register_blueprint(vehicle_bp, url_prefix='/api')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)