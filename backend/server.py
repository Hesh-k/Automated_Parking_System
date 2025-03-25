# Importing required frameworks, libraries and packages
from flask import Flask, jsonify, request
import firebase_admin
from firebase_admin import credentials, firestore, auth
from flask_cors import CORS

# Creating a flask app
app = Flask(__name__)
CORS(app)

# Initialize Firebase Admin SDK
cred = credentials.Certificate("../firebase/key.json")
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

# Add parking slot details to firestore database
@app.route('/add_slot', methods=['POST'])
def add_slot():
  data = request.json
  slot_ref = db.collection('slots').document(data['slotId'])
  slot_ref.set(data)
  return jsonify({"message": "Parking slot added successfully"}), 201

# Get parking slot details from firestore database
@app.route('/get_slots', methods=['GET'])
def get_slots():
  slots_ref = db.collection('slots').stream()
  slots = [{**slot.to_dict()} for slot in slots_ref]
  return jsonify(slots)

if __name__ == '__main__':
  app.run(debug=True)