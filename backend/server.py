from flask import Flask
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials
from routes.parking_routes import parking_bp
from routes.discount_routes import discount_bp

def create_app():
    # Creating a flask app
    app = Flask(__name__)
    CORS(app)

    # Initialize Firebase Admin SDK
    cred = credentials.Certificate("firebase/key.json")
    firebase_admin.initialize_app(cred)

    # Register blueprints
    app.register_blueprint(parking_bp, url_prefix='/api')
    app.register_blueprint(discount_bp, url_prefix='/api')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)