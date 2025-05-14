from flask import Blueprint, Response, jsonify
from services.number_plate_service import generate_frames as plate_frames, process_frame as plate_process
from models.number_plate_model import number_plate_model

number_plate_blueprint = Blueprint('number_plate', __name__)

@number_plate_blueprint.route('/number_plate/video_feed')
def number_plate_video_feed():
    return Response(plate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@number_plate_blueprint.route('/number_plate/data')
def number_plate_data():
    _, plate = plate_process()
    if plate:
        number_plate_model.update_plate(plate)
    return jsonify(number_plate_model.get_plate_data())