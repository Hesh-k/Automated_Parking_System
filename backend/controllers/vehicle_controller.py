from models.vehicle import Vehicle
from datetime import datetime
import qrcode
import os

class VehicleController:
    @staticmethod
    def create_vehicle(data):
        """Create a new vehicle entry"""
        try:
            # Generate QR code
            qr = qrcode.QRCode(version=1, box_size=10, border=5)
            qr.add_data(data.get('vehicleId'))
            qr.make(fit=True)
            qr_image = qr.make_image(fill_color="black", back_color="white")
            
            # Save QR code image
            qr_path = f"static/qrcodes/{data.get('vehicleId')}.png"
            os.makedirs(os.path.dirname(qr_path), exist_ok=True)
            qr_image.save(qr_path)
            
            vehicle = Vehicle(
                vehicle_id=data.get('vehicleId'),
                vehicle_type=data.get('vehicleType'),
                entry_time=datetime.fromisoformat(data.get('entryTime').replace('Z', '+00:00')),
                driver_name=data.get('driverName'),
                mobile_number=data.get('mobileNumber'),
                email=data.get('email'),
                purpose_of_visit=data.get('purposeOfVisit'),
                expected_duration_hours=data.get('expectedDurationHours'),
                qr_code=f"/static/qrcodes/{data.get('vehicleId')}.png"
            )
            
            return vehicle.save()
        except Exception as e:
            raise Exception(f"Error creating vehicle: {str(e)}")

    @staticmethod
    def update_vehicle_exit(vehicle_id):
        """Update vehicle exit time and calculate charges"""
        try:
            vehicle = Vehicle.get_by_id(vehicle_id)
            if not vehicle:
                raise Exception("Vehicle not found")
            
            if vehicle['status'] == 'exited':
                raise Exception("Vehicle has already exited")
            
            # Calculate charges based on duration
            exit_time = datetime.now()
            entry_time = vehicle['entryTime']
            duration = (exit_time - entry_time).total_seconds() / 3600  # Convert to hours
            
            # Basic rate calculation (can be modified based on business rules)
            hourly_rate = 100  # Example rate
            charge = duration * hourly_rate
            
            # Update vehicle record
            vehicle_obj = Vehicle(
                vehicle_id=vehicle_id,
                exit_time=exit_time,
                status='exited',
                charge=charge
            )
            
            return vehicle_obj.update()
        except Exception as e:
            raise Exception(f"Error updating vehicle exit: {str(e)}")

    @staticmethod
    def get_vehicle_details(vehicle_id):
        """Get detailed vehicle information"""
        try:
            vehicle = Vehicle.get_by_id(vehicle_id)
            if not vehicle:
                raise Exception("Vehicle not found")
            return vehicle
        except Exception as e:
            raise Exception(f"Error getting vehicle details: {str(e)}")

    @staticmethod
    def get_active_vehicles():
        """Get all vehicles currently in the parking lot"""
        try:
            return Vehicle.get_active_vehicles()
        except Exception as e:
            raise Exception(f"Error getting active vehicles: {str(e)}")

    @staticmethod
    def get_vehicle_history(vehicle_id):
        """Get vehicle entry/exit history"""
        try:
            vehicle = Vehicle.get_by_id(vehicle_id)
            if not vehicle:
                raise Exception("Vehicle not found")
            return vehicle
        except Exception as e:
            raise Exception(f"Error getting vehicle history: {str(e)}") 