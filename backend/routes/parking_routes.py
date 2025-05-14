from flask import Blueprint, jsonify, request
from controllers.parking_controller import ParkingSlotController

parking_bp = Blueprint('parking', __name__)

# Method to get all parking slots
@parking_bp.route('/get_slots', methods=['GET'])
def get_all_slots():
    try:
        slots = ParkingSlotController.get_all_slots()
        return jsonify(slots), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Method to get a specific parking slot by ID
@parking_bp.route('/get_slot/<slot_id>', methods=['GET'])
def get_slot_by_id(slot_id):
    try:
        slot = ParkingSlotController.get_slot_by_id(slot_id)
        if not slot:
            return jsonify({"error": "Slot not found"}), 404
        return jsonify(slot), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Method to create a new parking slot
@parking_bp.route('/add_slot', methods=['POST'])
def create_slot():
    try:
        data = request.json
        result = ParkingSlotController.add_slot(data)
        return jsonify({"message": "Parking slot added successfully", "data": result}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Method to update an existing parking slot
@parking_bp.route('/update_slot/<slot_id>', methods=['PUT'])
def update_slot(slot_id):
    slots = ParkingSlotController.update_slot(slot_id, request.json)
    return jsonify(slots)