from flask import Flask
from flask_cors import CORS
from routes.parking_routes import parking_blueprint
from routes.number_plate_routes import number_plate_blueprint

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Comment/uncomment the lines below to switch between services
app.register_blueprint(parking_blueprint, url_prefix='/api')  # For parking space detection
app.register_blueprint(number_plate_blueprint, url_prefix='/api')  # For number plate detection

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)


