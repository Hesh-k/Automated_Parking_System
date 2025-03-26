from flask import Blueprint, Response, jsonify
from services.vision_service import generate_frames as parking_frames, process_frame as parking_process
from models.parking_model import parking_model

parking_blueprint = Blueprint('parking', __name__)

@parking_blueprint.route('/parking/video_feed')
def parking_video_feed():
    return Response(parking_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@parking_blueprint.route('/parking/free_spaces')
def free_spaces():
    _, free, total = parking_process()
    parking_model.update_spaces(free, total)
    return jsonify({"free_spaces": parking_model.get_free_spaces()})

@parking_blueprint.route('/parking/occupied_spaces')
def occupied_spaces():
    _, free, total = parking_process()
    parking_model.update_spaces(free, total)
    return jsonify({"occupied_spaces": parking_model.get_occupied_spaces()})