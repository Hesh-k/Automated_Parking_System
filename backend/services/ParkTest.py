import cv2
import pickle
import cvzone
import numpy as np
import urllib.request
from flask import Flask, Response

app = Flask(__name__)

# ESP32-CAM URL (replace with your ESP32-CAM's IP address)
url = 'http://192.168.8.248/cam-hi.jpg'
width, height = 103, 43

# Load parking space positions
with open('CarParkPos', 'rb') as f:
    posList = pickle.load(f)

# Function to process frames and detect spaces
def checkSpaces(img, imgThres):
    spaces = 0
    for pos in posList:
        x, y = pos
        w, h = width, height

        imgCrop = imgThres[y:y + h, x:x + w]
        count = cv2.countNonZero(imgCrop)

        if count < 900:  # Threshold for detecting an empty space
            color = (0, 200, 0)  # Green for free
            thic = 5
            spaces += 1
        else:
            color = (0, 0, 200)  # Red for occupied
            thic = 2

        cv2.rectangle(img, (x, y), (x + w, y + h), color, thic)
        cv2.putText(img, str(count), (x, y + h - 6), cv2.FONT_HERSHEY_PLAIN, 1, color, 2)

    cvzone.putTextRect(img, f'Free: {spaces}/{len(posList)}', (50, 60), thickness=3, offset=20,
                       colorR=(0, 200, 0))
    return img

def generate_frames():
    # Trackbar values (hardcoded for simplicity; adjust as needed)
    val1, val2, val3 = 25, 16, 5
    if val1 % 2 == 0: val1 += 1
    if val3 % 2 == 0: val3 += 1

    while True:
        try:
            # Fetch live frame from ESP32-CAM
            imgResponse = urllib.request.urlopen(url)
            imgNp = np.array(bytearray(imgResponse.read()), dtype=np.uint8)
            img = cv2.imdecode(imgNp, -1)

            if img is None:
                continue

            # Rotate if necessary (adjust based on your camera orientation)
            img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)

            # Image processing for detection
            imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            imgBlur = cv2.GaussianBlur(imgGray, (3, 3), 1)
            imgThres = cv2.adaptiveThreshold(imgBlur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                             cv2.THRESH_BINARY_INV, val1, val2)
            imgThres = cv2.medianBlur(imgThres, val3)
            kernel = np.ones((3, 3), np.uint8)
            imgThres = cv2.dilate(imgThres, kernel, iterations=1)

            # Check parking spaces and annotate the frame
            img = checkSpaces(img, imgThres)

            # Encode frame as JPEG
            ret, buffer = cv2.imencode('.jpg', img)
            frame = buffer.tobytes()

            # Yield frame in MJPEG format
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

        except Exception as e:
            print(f"Error: {e}")
            continue

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/')
def index():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Parking Space Detection</title>
    </head>
    <body>
        <h1>Live Parking Space Detection</h1>
        <img src="/video_feed" alt="Video Feed">
    </body>
    </html>
    """

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)