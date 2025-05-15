from flask import Blueprint, request, jsonify
from controllers.vehicle_controller import VehicleController

vehicle_bp = Blueprint('vehicle', __name__)

@vehicle_bp.route('/vehicles', methods=['POST'])
def create_vehicle():
    """Create a new vehicle entry"""
    try:
        data = request.get_json()
        result = VehicleController.create_vehicle(data)
        return jsonify(result), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@vehicle_bp.route('/vehicles/<vehicle_id>', methods=['GET'])
def get_vehicle_details(vehicle_id):
    """Get detailed vehicle information"""
    try:
        result = VehicleController.get_vehicle_details(vehicle_id)
        if not result:
            return jsonify({'error': 'Vehicle not found'}), 404
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@vehicle_bp.route('/vehicles/<vehicle_id>', methods=['PUT'])
def update_vehicle(vehicle_id):
    """Update vehicle details"""
    try:
        data = request.get_json()
        result = VehicleController.update_vehicle(vehicle_id, data)
        if not result:
            return jsonify({'error': 'Vehicle not found'}), 404
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@vehicle_bp.route('/vehicles/<vehicle_id>', methods=['DELETE'])
def delete_vehicle(vehicle_id):
    """Delete a vehicle record"""
    try:
        result = VehicleController.delete_vehicle(vehicle_id)
        if not result:
            return jsonify({'error': 'Vehicle not found'}), 404
        return jsonify({'message': 'Vehicle deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@vehicle_bp.route('/vehicles/<vehicle_id>/exit', methods=['PUT'])
def update_vehicle_exit(vehicle_id):
    """Update vehicle exit time and calculate charges"""
    try:
        result = VehicleController.update_vehicle_exit(vehicle_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@vehicle_bp.route('/vehicles/active', methods=['GET'])
def get_active_vehicles():
    """Get all vehicles currently in the parking lot"""
    try:
        result = VehicleController.get_active_vehicles()
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@vehicle_bp.route('/vehicles/<vehicle_id>/history', methods=['GET'])
def get_vehicle_history(vehicle_id):
    """Get vehicle entry/exit history"""
    try:
        result = VehicleController.get_vehicle_history(vehicle_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@vehicle_bp.route('/vehicles/exit/<plate_number>', methods=['GET'])
def get_vehicle_by_plate(plate_number):
    """Get vehicle details by plate number for exit detection"""
    try:
        result = VehicleController.get_vehicle_by_plate(plate_number)
        if not result:
            return jsonify({'error': 'Vehicle not found in parking lot'}), 404
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@vehicle_bp.route('/vehicles/<plate_number>/confirm_exit', methods=['POST'])
def confirm_vehicle_exit(plate_number):
    """Confirm payment and mark vehicle as exited"""
    try:
        result = VehicleController.confirm_vehicle_exit(plate_number)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@vehicle_bp.route('/vehicles/<plate_number>/pay', methods=['POST'])
def pay_for_vehicle(plate_number):
    """Mark payment as completed for a vehicle by plate number"""
    try:
        result = VehicleController.mark_payment_completed(plate_number)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@vehicle_bp.route('/vehicles/all', methods=['GET'])
def get_all_vehicles():
    """Get all vehicles (admin view)"""
    try:
        result = VehicleController.get_all_vehicles()
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400 