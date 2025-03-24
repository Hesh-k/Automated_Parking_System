import cv2
import pickle
import urllib.request
import numpy as np

width, height = 107, 48
url = 'http://192.168.8.248/cam-hi.jpg'  # Replace with ESP32-CAM IP

try:
    with open('CarParkPos', 'rb') as f:
        posList = pickle.load(f)
except:
    posList = []


def mouseClick(events, x, y, flags, params):
    if events == cv2.EVENT_LBUTTONDOWN:
        posList.append((x, y))
    if events == cv2.EVENT_RBUTTONDOWN:
        for i, pos in enumerate(posList):
            x1, y1 = pos
            if x1 < x < x1 + width and y1 < y < y1 + height:
                posList.pop(i)

    with open('CarParkPos', 'wb') as f:
        pickle.dump(posList, f)


while True:
    # Fetch live frame from ESP32-CAM
    imgResponse = urllib.request.urlopen(url)
    imgNp = np.array(bytearray(imgResponse.read()), dtype=np.uint8)
    img = cv2.imdecode(imgNp, -1)

    # Rotate if necessary (adjust based on your camera orientation)
    img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)

    # Draw rectangles for existing parking positions
    for pos in posList:
        cv2.rectangle(img, pos, (pos[0] + width, pos[1] + height), (255, 0, 255), 2)

    cv2.imshow("Image", img)
    cv2.setMouseCallback("Image", mouseClick)
    key = cv2.waitKey(1)
    if key == 27:  # Exit on ESC
        break

cv2.destroyAllWindows()