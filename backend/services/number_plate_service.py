import cv2
import pandas as pd
from ultralytics import YOLO
import numpy as np
import pytesseract
import urllib.request
import re
from collections import Counter
import os

# Load the YOLOv8 model from the services folder
SERVICE_DIR = os.path.dirname(os.path.abspath(__file__))  # Points to /backend/services/
model = YOLO(os.path.join(SERVICE_DIR, 'best.pt'))

# ESP32-CAM URL
url = 'http://192.168.8.248/cam-hi.jpg'

# Load class list from the services folder
with open(os.path.join(SERVICE_DIR, 'coco1.txt'), 'r') as my_file:
    class_list = my_file.read().split('\n')

# Centered area of interest
area = [(210, 100), (210, 400), (810, 400), (810, 100)]

# Sri Lankan number plate regex (e.g., "ABC-1234" or "AB-1234")
plate_pattern = re.compile(r'^[A-Z]{2,3}-[0-9]{4}$')

# Buffer for multiple readings
reading_buffer = []
BUFFER_SIZE = 10  # Number of readings to consider

def is_valid_plate(text):
    """Check if text matches Sri Lankan number plate format."""
    return bool(plate_pattern.match(text))

def get_most_frequent_plate():
    """Return the most frequent valid plate from the buffer."""
    valid_plates = [text for text in reading_buffer if is_valid_plate(text)]
    if not valid_plates:
        return None
    return Counter(valid_plates).most_common(1)[0][0]

def process_frame():
    """Process a frame and return annotated image and detected plate."""
    try:
        img_response = urllib.request.urlopen(url)
        img_np = np.array(bytearray(img_response.read()), dtype=np.uint8)
        frame = cv2.imdecode(img_np, -1)

        if frame is None:
            return None, None

        frame = cv2.resize(frame, (1020, 500))
        results = model.predict(frame)
        boxes = results[0].boxes.data
        px = pd.DataFrame(boxes.cpu().numpy()).astype("float")

        detected_plate = None
        for index, row in px.iterrows():
            x1, y1, x2, y2 = map(int, [row[0], row[1], row[2], row[3]])
            conf = row[4]
            d = int(row[5])
            c = class_list[d]

            cx = (x1 + x2) // 2
            cy = (y1 + y2) // 2
            if cv2.pointPolygonTest(np.array(area, np.int32), (cx, cy), False) >= 0:
                crop = frame[y1:y2, x1:x2]
                if crop.size == 0:
                    continue

                gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
                thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                               cv2.THRESH_BINARY_INV, 11, 2)
                kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
                sharp = cv2.filter2D(thresh, -1, kernel)

                text = pytesseract.image_to_string(sharp, config='--psm 7 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-').strip()
                text = text.replace('(', '').replace(')', '').replace(',', '').replace(']', '')

                if text:
                    reading_buffer.append(text)
                    if len(reading_buffer) > BUFFER_SIZE:
                        reading_buffer.pop(0)
                    most_frequent = get_most_frequent_plate()
                    if most_frequent:
                        detected_plate = most_frequent

                # Draw bounding box
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, f"{text} ({conf:.2f})", (x1, y1-10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        cv2.polylines(frame, [np.array(area, np.int32)], True, (255, 0, 0), 2)
        return frame, detected_plate

    except Exception as e:
        print(f"Error in number plate service: {e}")
        return None, None

def generate_frames():
    """Generator for MJPEG video stream."""
    while True:
        frame, _ = process_frame()
        if frame is not None:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')