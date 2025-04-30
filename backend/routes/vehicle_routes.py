from flask import Blueprint, request, jsonify
from controllers.vehicle_controller import VehicleController

vehicle_bp = Blueprint('vehicle', __name__)

@vehicle_bp.route('/api/vehicles', methods=['POST'])
def create_vehicle():
    """Create a new vehicle entry"""
    try:
        data = request.get_json()
        result = VehicleController.create_vehicle(data)
        return jsonify(result), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@vehicle_bp.route('/api/vehicles/<vehicle_id>/exit', methods=['PUT'])
def update_vehicle_exit(vehicle_id):
    """Update vehicle exit time and calculate charges"""
    try:
        result = VehicleController.update_vehicle_exit(vehicle_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@vehicle_bp.route('/api/vehicles/<vehicle_id>', methods=['GET'])
def get_vehicle_details(vehicle_id):
    """Get detailed vehicle information"""
    try:
        result = VehicleController.get_vehicle_details(vehicle_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@vehicle_bp.route('/api/vehicles/active', methods=['GET'])
def get_active_vehicles():
    """Get all vehicles currently in the parking lot"""
    try:
        result = VehicleController.get_active_vehicles()
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@vehicle_bp.route('/api/vehicles/<vehicle_id>/history', methods=['GET'])
def get_vehicle_history(vehicle_id):
    """Get vehicle entry/exit history"""
    try:
        result = VehicleController.get_vehicle_history(vehicle_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404 