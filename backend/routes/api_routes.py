from flask import Blueprint, Response, jsonify
from services.vision_service import generate_frames, process_frame
from models.parking_model import parking_model

api_blueprint = Blueprint('api', __name__)

@api_blueprint.route('/video_feed')
def video_feed():
    """Stream the processed video feed."""
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@api_blueprint.route('/free_spaces')
def free_spaces():
    """API to get the number of free parking spaces."""
    _, free, total = process_frame()  # Get latest counts
    parking_model.update_spaces(free, total)
    return jsonify({"free_spaces": parking_model.get_free_spaces()})

@api_blueprint.route('/occupied_spaces')
def occupied_spaces():
    """API to get the number of occupied parking spaces."""
    _, free, total = process_frame()  # Get latest counts
    parking_model.update_spaces(free, total)
    return jsonify({"occupied_spaces": parking_model.get_occupied_spaces()})