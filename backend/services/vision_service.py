import os
import cv2
import pickle
import numpy as np
import urllib.request

# ESP32-CAM URL (replace with your ESP32-CAM's IP address)
url = 'http://192.168.8.248/cam-hi.jpg'
width, height = 103, 43

# Load parking space positions from the services folder
SERVICE_DIR = os.path.dirname(os.path.abspath(__file__))  # Points to /backend/services/
CAR_PARK_POS_PATH = os.path.join(SERVICE_DIR, 'CarParkPos')
with open(CAR_PARK_POS_PATH, 'rb') as f:
    posList = pickle.load(f)

def process_frame():
    """Process a single frame and return the annotated image and space counts."""
    try:
        # Fetch live frame from ESP32-CAM
        img_response = urllib.request.urlopen(url)
        img_np = np.array(bytearray(img_response.read()), dtype=np.uint8)
        img = cv2.imdecode(img_np, -1)

        if img is None:
            return None, 0, 0

        # Rotate if necessary
        img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)

        # Image processing for detection
        img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        img_blur = cv2.GaussianBlur(img_gray, (3, 3), 1)
        img_thres = cv2.adaptiveThreshold(img_blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                          cv2.THRESH_BINARY_INV, 25, 16)
        img_thres = cv2.medianBlur(img_thres, 5)
        kernel = np.ones((3, 3), np.uint8)
        img_thres = cv2.dilate(img_thres, kernel, iterations=1)

        # Check parking spaces
        spaces = 0
        total = len(posList)
        for pos in posList:
            x, y = pos
            w, h = width, height
            img_crop = img_thres[y:y + h, x:x + w]
            count = cv2.countNonZero(img_crop)

            if count < 900:  # Threshold for empty space
                color = (0, 200, 0)  # Green for free
                thic = 5
                spaces += 1
            else:
                color = (0, 0, 200)  # Red for occupied
                thic = 2

            cv2.rectangle(img, (x, y), (x + w, y + h), color, thic)
            cv2.putText(img, str(count), (x, y + h - 6), cv2.FONT_HERSHEY_PLAIN, 1, color, 2)

        return img, spaces, total

    except Exception as e:
        print(f"Error in vision service: {e}")
        return None, 0, 0

def generate_frames():
    """Generator for MJPEG video stream."""
    while True:
        img, _, _ = process_frame()
        if img is not None:
            ret, buffer = cv2.imencode('.jpg', img)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')