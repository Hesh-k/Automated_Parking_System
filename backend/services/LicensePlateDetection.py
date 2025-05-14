import cv2
import pandas as pd
from ultralytics import YOLO
import numpy as np
import pytesseract
from datetime import datetime
import urllib.request

# Load the YOLOv8 model
model = YOLO('best.pt')

# Define the ESP32-CAM URL (replace with your ESP32-CAM's IP address)
url = 'http://192.168.8.248/cam-hi.jpg'  # Adjust IP based on Serial Monitor output

# Define a mouse callback function to print coordinates (for debugging area)
def RGB(event, x, y, flags, param):
    if event == cv2.EVENT_MOUSEMOVE:
        print(f"Mouse coordinates: [{x}, {y}]")

# Set up OpenCV window and mouse callback
cv2.namedWindow('RGB')
cv2.setMouseCallback('RGB', RGB)

# Load class list (assuming coco1.txt has "Number Plate" as the only entry)
with open("coco1.txt", "r") as my_file:
    class_list = my_file.read().split("\n")

# Define the larger area of interest
area = [(0, 400), (0, 480), (1019, 480), (1019, 400)]  # Larger polygon

# Initialize variables
count = 0
processed_numbers = set()  # To avoid duplicates
output_file = "car_plate_data.txt"

# Write headers to output file
with open(output_file, "w") as file:
    file.write("NumberPlate\tDate\tTime\n")

while True:
    try:
        # Fetch frame from ESP32-CAM
        img_response = urllib.request.urlopen(url)
        img_np = np.array(bytearray(img_response.read()), dtype=np.uint8)
        frame = cv2.imdecode(img_np, -1)

        if frame is None:
            print("Error: Failed to decode frame from ESP32-CAM.")
            continue

        # Skip frames to speed up processing (every 3rd frame)
        count += 1
        if count % 3 != 0:
            continue

        # Resize frame for consistent processing
        frame = cv2.resize(frame, (1020, 500))

        # Run YOLOv8 prediction
        results = model.predict(frame)
        boxes = results[0].boxes.data
        px = pd.DataFrame(boxes.cpu().numpy()).astype("float")

        # Process each detected bounding box
        for index, row in px.iterrows():
            x1, y1, x2, y2 = map(int, [row[0], row[1], row[2], row[3]])
            conf = row[4]  # Confidence score
            d = int(row[5])  # Class ID (should be 0 for "Number Plate")
            c = class_list[d]  # Class name

            # Calculate center of bounding box
            cx = (x1 + x2) // 2
            cy = (y1 + y2) // 2

            # Check if the center is within the defined area
            result = cv2.pointPolygonTest(np.array(area, np.int32), (cx, cy), False)
            if result >= 0:  # Inside the polygon
                # Crop the number plate region
                crop = frame[y1:y2, x1:x2]
                if crop.size == 0:
                    continue
                cv2.imwrite(f"crop_{count}_{index}.jpg", crop)  # Save for debugging

                # Preprocess for OCR
                gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
                thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                               cv2.THRESH_BINARY_INV, 11, 2)
                kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
                sharp = cv2.filter2D(thresh, -1, kernel)

                # Extract text using Tesseract
                text = pytesseract.image_to_string(sharp, config='--psm 7 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-').strip()
                text = text.replace('(', '').replace(')', '').replace(',', '').replace(']', '')

                # Process unique number plates
                if text and text not in processed_numbers:
                    processed_numbers.add(text)
                    current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    with open(output_file, "a") as file:
                        file.write(f"{text}\t{current_datetime}\n")
                    print(f"Detected: {text} at {current_datetime}")

                    # Draw bounding box on frame
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.putText(frame, f"{text} ({conf:.2f})", (x1, y1-10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

                # Show cropped region (optional)
                cv2.imshow('crop', crop)

        # Draw the area of interest
        cv2.polylines(frame, [np.array(area, np.int32)], True, (255, 0, 0), 2)

        # Display the frame
        cv2.imshow("RGB", frame)

        # Exit on 'Esc' key
        if cv2.waitKey(1) & 0xFF == 27:
            break

    except urllib.error.URLError as e:
        print(f"Error fetching frame from ESP32-CAM: {e}")
        continue
    except Exception as e:
        print(f"Unexpected error: {e}")
        break

# Cleanup
cv2.destroyAllWindows()
print(f"Results saved to {output_file}")