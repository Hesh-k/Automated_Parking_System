from flask import Flask
from routes.api_routes import api_blueprint

from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# Register the API routes blueprint
app.register_blueprint(api_blueprint, url_prefix='/api')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)


