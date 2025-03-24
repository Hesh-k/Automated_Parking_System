import cv2
import pickle
import cvzone
import numpy as np
import urllib.request

url = 'http://192.168.8.248/cam-hi.jpg'  # Replace with ESP32-CAM IP
width, height = 103, 43

with open('CarParkPos', 'rb') as f:
    posList = pickle.load(f)


def empty(a):
    pass


cv2.namedWindow("Vals")
cv2.resizeWindow("Vals", 640, 240)
cv2.createTrackbar("Val1", "Vals", 25, 50, empty)
cv2.createTrackbar("Val2", "Vals", 16, 50, empty)
cv2.createTrackbar("Val3", "Vals", 5, 50, empty)


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


while True:
    # Fetch live frame from ESP32-CAM
    imgResponse = urllib.request.urlopen(url)
    imgNp = np.array(bytearray(imgResponse.read()), dtype=np.uint8)
    img = cv2.imdecode(imgNp, -1)

    # Rotate if necessary (adjust based on your camera orientation)
    img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)

    # Image processing for detection
    imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    imgBlur = cv2.GaussianBlur(imgGray, (3, 3), 1)

    val1 = cv2.getTrackbarPos("Val1", "Vals")
    val2 = cv2.getTrackbarPos("Val2", "Vals")
    val3 = cv2.getTrackbarPos("Val3", "Vals")
    if val1 % 2 == 0: val1 += 1
    if val3 % 2 == 0: val3 += 1

    imgThres = cv2.adaptiveThreshold(imgBlur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                     cv2.THRESH_BINARY_INV, val1, val2)
    imgThres = cv2.medianBlur(imgThres, val3)
    kernel = np.ones((3, 3), np.uint8)
    imgThres = cv2.dilate(imgThres, kernel, iterations=1)

    # Check parking spaces
    checkSpaces(img, imgThres)

    # Display output
    cv2.imshow("Image", img)
    # cv2.imshow("ImageThres", imgThres)  # Uncomment to debug thresholded image

    key = cv2.waitKey(1)
    if key == 27:  # Exit on ESC
        break

cv2.destroyAllWindows()