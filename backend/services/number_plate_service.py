import cv2
import pandas as pd
from ultralytics import YOLO
import numpy as np
import os
import torch
import requests
import base64
import json
import re
from collections import Counter
import time

# === CONFIGURATION ===
API_KEY = "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"  # Your Perplexity API key
ENDPOINT_URL = "https://api.perplexity.ai/chat/completions"

# Load the YOLOv11m model from the services folder
SERVICE_DIR = os.path.dirname(os.path.abspath(__file__))
model = YOLO(os.path.join(SERVICE_DIR, 'best.pt'))

# Optimize YOLOv11m for speed
model.to('cuda' if torch.cuda.is_available() else 'cpu')
try:
    model.fuse()
except Exception as e:
    print(f"Model fusion not supported or failed: {e}")

# Global webcam object
cap = None

# Timing variables
last_photo_time = 0  # Timestamp of last photo sent to API
last_success_time = 0  # Timestamp of last successful plate recognition
PHOTO_INTERVAL = 15  # Seconds between photos
COOLDOWN_PERIOD = 30  # Seconds to wait after successful recognition

def initialize_webcam():
    global cap
    if cap is not None and cap.isOpened():
        cap.release()
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        raise Exception("Error: Could not open webcam. Check connection or device index.")
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    return cap

# Initialize webcam at startup
initialize_webcam()

# Load class list from the services folder
with open(os.path.join(SERVICE_DIR, 'coco1.txt'), 'r') as my_file:
    class_list = my_file.read().split('\n')

# Centered area of interest
area = [(210, 100), (210, 400), (810, 400), (810, 100)]

# Sri Lankan number plate regex
plate_pattern = re.compile(r'^[A-Z]{2,3}-[0-9]{4}$')

# Buffer for multiple readings
reading_buffer = []
BUFFER_SIZE = 10
FRAME_SKIP = 2
frame_counter = 0

def is_valid_plate(text):
    return bool(plate_pattern.match(text))

def get_most_frequent_plate():
    valid_plates = [text for text in reading_buffer if is_valid_plate(text)]
    if not valid_plates:
        return None
    return Counter(valid_plates).most_common(1)[0][0]

def preprocess_for_ocr(crop):
    # Convert to grayscale
    gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
    # Denoise with Gaussian blur
    denoised = cv2.GaussianBlur(gray, (5, 5), 0)
    # Apply CLAHE for contrast enhancement
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    contrast = clahe.apply(denoised)
    # Adaptive thresholding
    thresh = cv2.adaptiveThreshold(contrast, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                   cv2.THRESH_BINARY_INV, 11, 2)
    # Morphological operation to connect broken characters
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    dilated = cv2.dilate(thresh, kernel, iterations=1)
    # Sharpen the image
    sharpen_kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
    sharp = cv2.filter2D(dilated, -1, sharpen_kernel)
    # Resize the image
    scale_factor = 3
    resized = cv2.resize(sharp, None, fx=scale_factor, fy=scale_factor, interpolation=cv2.INTER_LINEAR)
    return resized

def encode_image_for_api(crop):
    # Save the crop temporarily as JPEG
    _, buffer = cv2.imencode('.jpg', crop)
    base64_image = base64.b64encode(buffer).decode('utf-8')
    return base64_image

def read_plate_with_llm(crop):
    try:
        # Preprocess and encode the image
        processed_crop = preprocess_for_ocr(crop)
        base64_image = encode_image_for_api(processed_crop)

        # API request setup
        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "model": "sonar-pro",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": (
                                "Extract the vehicle license plate number from this image, focusing only on the larger characters. "
                                "Return only a JSON object with a single key 'license_plate_number' and the extracted number as the value. "
                                "Do not include any additional text, descriptions, or fields."
                            )
                        },
                        {
                            "type": "image_url",
                            "image_url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    ]
                }
            ],
            "max_tokens": 50
        }

        # Send request to Perplexity API
        response = requests.post(ENDPOINT_URL, headers=headers, json=data)
        if not response.ok:
            print(f"API Error: {response.status_code} {response.text}")
            return ""

        result = response.json()
        content = result['choices'][0]['message']['content']
        json_match = re.search(r'\{.*?\}', content, re.DOTALL)
        if json_match:
            license_plate_json = json.loads(json_match.group(0))
            return license_plate_json.get('license_plate_number', '')
        return ""
    except Exception as e:
        print(f"Error in LLM plate reading: {e}")
        return ""

def process_frame():
    global frame_counter, last_photo_time, last_success_time
    try:
        if not cap.isOpened():
            print("Webcam not opened, reinitializing...")
            initialize_webcam()

        ret, frame = cap.read()
        if not ret or frame is None:
            print("Error: Failed to capture frame from webcam. Reinitializing...")
            initialize_webcam()
            ret, frame = cap.read()
            if not ret or frame is None:
                return None, None

        frame = cv2.resize(frame, (640, 480))
        frame_counter += 1
        if frame_counter % FRAME_SKIP != 0:
            cv2.polylines(frame, [np.array(area, np.int32)], True, (255, 0, 0), 2)
            return frame, None

        current_time = time.time()
        # Check if we're in the 30-second cooldown period after a successful recognition
        if current_time - last_success_time < COOLDOWN_PERIOD:
            cv2.polylines(frame, [np.array(area, np.int32)], True, (255, 0, 0), 2)
            return frame, get_most_frequent_plate()

        results = model.predict(frame, conf=0.5, iou=0.7, imgsz=416, half=True,
                                device='cuda' if torch.cuda.is_available() else 'cpu')
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

                # Check if 15 seconds have passed since the last photo
                if current_time - last_photo_time >= PHOTO_INTERVAL:
                    # Use LLM to read the plate
                    text = read_plate_with_llm(crop)
                    text = text.replace(' ', '')  # Remove spaces
                    last_photo_time = current_time  # Update last photo time

                    if text and is_valid_plate(text):
                        reading_buffer.append(text)
                        if len(reading_buffer) > BUFFER_SIZE:
                            reading_buffer.pop(0)
                        most_frequent = get_most_frequent_plate()
                        if most_frequent:
                            detected_plate = most_frequent
                            last_success_time = current_time  # Start 30-second cooldown

                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.putText(frame, f"{text} ({conf:.2f})", (x1, y1 - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        cv2.polylines(frame, [np.array(area, np.int32)], True, (255, 0, 0), 2)
        return frame, detected_plate

    except Exception as e:
        print(f"Error in number plate service: {e}")
        return None, None

def generate_frames():
    while True:
        frame, _ = process_frame()
        if frame is not None:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

def cleanup():
    global cap
    if cap is not None and cap.isOpened():
        cap.release()
    cv2.destroyAllWindows()