from flask import Blueprint, jsonify, request
from controllers.parking_controller import ParkingController

parking_bp = Blueprint('parking', __name__)

@parking_bp.route('/add_slot', methods=['POST'])
def add_slot():
    data = request.json
    result = ParkingController.add_slot(data)
    return jsonify({"message": "Parking slot added successfully", "data": result}), 201

@parking_bp.route('/get_slots', methods=['GET'])
def get_slots():
    slots = ParkingController.get_all_slots()
    return jsonify(slots) 