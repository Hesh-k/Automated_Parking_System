
# SmartPark - Automated Parking System

SmartPark represents a transformative advancement in parking management technology, addressing the inefficiencies and complexities of traditional parking systems. By fully automating the parking process, SmartPark eliminates the need for human intervention, saving time and reducing errors associated with manual operations.

## Features

SmartPark is a smart car park management system that leverages computer vision and machine learning to:
- Extract vehicle details automatically.
- Identify occupied and free parking slots in real-time.
- Enable users to complete the parking process without external human interaction.
- Support digital payment methods for a seamless user experience.

## Key Modules

SmartPark is built on a robust integration of **React**, **Flask**, and **Firebase**, enabling real-time data processing and management. The system comprises the following key modules:

### 1. User Management
- Secure and customizable access control for drivers and administrators.
- Ensures data privacy and role-based functionality.

### 2. Parking Slot Management
- Real-time monitoring and allocation of parking spaces using sensor data.
- Intuitive React-based interface for slot selection and booking.

### 3. Backend Processing
- Efficient handling of requests and data storage through Flask and Firebase.
- Supports dynamic updates and conflict-free slot assignments.

### 4. Notification System
- Automated alerts for:
  - Slot availability.
  - Booking confirmations.
  - Parking status updates.
- Ensures timely communication with users.

## Standout Feature: Auto-Allocation
The **Auto-Allocation** feature instantly assigns optimal parking slots based on:
- Vehicle size.
- Proximity to the user.
- Real-time availability.

This feature adapts to real-time changes such as cancellations or unexpected occupancy shifts, maximizing efficiency and user convenience.

## Benefits
- **Enhanced Efficiency**: Automates parking operations and reduces human error.
- **User-Friendly**: Simplifies the parking process with an intuitive interface and digital payment support.
- **Real-Time Insights**: Utilizes sensors and machine learning for accurate and timely updates.
- **Scalable Solution**: Designed to handle multiple variables and constraints seamlessly.

## Getting Started

### Prerequisites
- Ensure you have **Node.js**, **Python**, and **Firebase CLI** installed.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Hesh-k/Automated_Parking_System.git
   cd Automated_Parking_System
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

4. Configure Firebase for real-time database and authentication.

### Running the Application
1. Start the backend server:
   ```bash
   cd backend
   flask run
   ```

2. Start the frontend server:
   ```bash
   cd frontend
   npm start
   ```

3. Access the system at `http://localhost:3000`.

## Contributing
Contributions are welcome! Please follow the standard fork-and-pull model:
1. Fork this repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.

## License
This project is licensed under the [MIT License](LICENSE).

## Acknowledgements
- Built with **React**, **Flask**, and **Firebase**.
- Powered by cutting-edge **Computer Vision** and **Machine Learning** technologies.

---

Simplify your parking experience with **SmartPark**—intelligent, automated, and user-friendly!
```

