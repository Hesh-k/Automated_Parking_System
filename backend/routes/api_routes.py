from flask import Blueprint, Response, jsonify
from services.vision_service import generate_frames as parking_frames, process_frame as parking_process
from services.number_plate_service import generate_frames as plate_frames, process_frame as plate_process
from models.parking_model import parking_model
from models.number_plate_model import number_plate_model

api_blueprint = Blueprint('api', __name__)

# Parking Space APIs
@api_blueprint.route('/parking/video_feed')
def parking_video_feed():
    return Response(parking_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@api_blueprint.route('/parking/free_spaces')
def free_spaces():
    _, free, total = parking_process()
    parking_model.update_spaces(free, total)
    return jsonify({"free_spaces": parking_model.get_free_spaces()})

@api_blueprint.route('/parking/occupied_spaces')
def occupied_spaces():
    _, free, total = parking_process()
    parking_model.update_spaces(free, total)
    return jsonify({"occupied_spaces": parking_model.get_occupied_spaces()})

# Number Plate APIs
@api_blueprint.route('/number_plate/video_feed')
def number_plate_video_feed():
    return Response(plate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@api_blueprint.route('/number_plate/data')
def number_plate_data():
    _, plate = plate_process()
    if plate:
        number_plate_model.update_plate(plate)
    return jsonify(number_plate_model.get_plate_data())