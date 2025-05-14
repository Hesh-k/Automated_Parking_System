from models.vehicle import Vehicle
from datetime import datetime
import qrcode
import os

class VehicleController:
    @staticmethod
    def create_vehicle(data):
        """Create a new vehicle entry"""
        try:
            # Check if vehicle with same ID already exists
            existing_vehicle = Vehicle.get_by_id(data.get('vehicleId'))
            if existing_vehicle:
                raise Exception("Vehicle with this ID already exists")

            # Generate QR code
            qr = qrcode.QRCode(version=1, box_size=10, border=5)
            qr.add_data(data.get('vehicleId'))
            qr.make(fit=True)
            qr_image = qr.make_image(fill_color="black", back_color="white")
            
            # Save QR code image
            qr_path = f"static/qrcodes/{data.get('vehicleId')}.png"
            os.makedirs(os.path.dirname(qr_path), exist_ok=True)
            qr_image.save(qr_path)
            
            # Create vehicle object with default status
            vehicle = Vehicle(
                vehicle_id=data.get('vehicleId'),
                vehicle_type=data.get('vehicleType', 'Car'),  # Default to Car if not specified
                entry_time=datetime.fromisoformat(data.get('entryTime', datetime.now().isoformat()).replace('Z', '+00:00')),
                driver_name=data.get('driverName'),
                mobile_number=data.get('mobileNumber'),
                email=data.get('email'),
                purpose_of_visit=data.get('purposeOfVisit'),
                expected_duration_hours=data.get('expectedDurationHours'),
                status='pending',  # Initial status is pending until details are updated
                qr_code=f"/static/qrcodes/{data.get('vehicleId')}.png",
                plate_number=data.get('plateNumber')  # Add plate number
            )
            
            return vehicle.save()
        except Exception as e:
            # Clean up QR code if creation fails
            qr_path = f"static/qrcodes/{data.get('vehicleId')}.png"
            if os.path.exists(qr_path):
                os.remove(qr_path)
            raise Exception(f"Error creating vehicle: {str(e)}")

    @staticmethod
    def get_vehicle_details(vehicle_id):
        """Get detailed vehicle information"""
        try:
            vehicle = Vehicle.get_by_id(vehicle_id)
            if not vehicle:
                return None
            return vehicle
        except Exception as e:
            raise Exception(f"Error getting vehicle details: {str(e)}")

    @staticmethod
    def update_vehicle(vehicle_id, data):
        """Update vehicle details"""
        try:
            # First check if vehicle exists
            existing_vehicle = Vehicle.get_by_id(vehicle_id)
            if not existing_vehicle:
                return None

            # Validate required fields if status is being updated to 'entered'
            if data.get('status') == 'entered':
                required_fields = ['driverName', 'mobileNumber', 'email', 'purposeOfVisit', 'expectedDurationHours']
                for field in required_fields:
                    if not data.get(field) and not existing_vehicle.get(field):
                        raise Exception(f"Field '{field}' is required for vehicle entry")

            # Create vehicle object with updated data
            vehicle = Vehicle(
                vehicle_id=vehicle_id,
                vehicle_type=data.get('vehicleType', existing_vehicle.get('vehicleType')),
                entry_time=existing_vehicle.get('entryTime'),
                exit_time=existing_vehicle.get('exitTime'),
                driver_name=data.get('driverName', existing_vehicle.get('driverName')),
                mobile_number=data.get('mobileNumber', existing_vehicle.get('mobileNumber')),
                email=data.get('email', existing_vehicle.get('email')),
                purpose_of_visit=data.get('purposeOfVisit', existing_vehicle.get('purposeOfVisit')),
                expected_duration_hours=data.get('expectedDurationHours', existing_vehicle.get('expectedDurationHours')),
                status=data.get('status', existing_vehicle.get('status')),
                qr_code=existing_vehicle.get('qrCode'),
                charge=existing_vehicle.get('charge', 0)
            )
            
            updated_data = vehicle.update()
            
            # If status changed to entered, log entry time
            if data.get('status') == 'entered' and existing_vehicle.get('status') != 'entered':
                vehicle.entry_time = datetime.now()
                updated_data = vehicle.update()
            
            return updated_data
        except Exception as e:
            raise Exception(f"Error updating vehicle: {str(e)}")

    @staticmethod
    def delete_vehicle(vehicle_id):
        """Delete a vehicle record"""
        try:
            # First check if vehicle exists
            existing_vehicle = Vehicle.get_by_id(vehicle_id)
            if not existing_vehicle:
                return None

            # Check if vehicle can be deleted (only pending or exited vehicles can be deleted)
            status = existing_vehicle.get('status')
            if status == 'entered':
                raise Exception("Cannot delete vehicle that is currently parked")

            # Delete QR code file if it exists
            qr_code_path = existing_vehicle.get('qrCode')
            if qr_code_path:
                full_path = os.path.join(os.path.dirname(__file__), '..', qr_code_path.lstrip('/'))
                if os.path.exists(full_path):
                    os.remove(full_path)

            # Delete vehicle record
            vehicle = Vehicle(vehicle_id=vehicle_id)
            return vehicle.delete()
        except Exception as e:
            raise Exception(f"Error deleting vehicle: {str(e)}")

    @staticmethod
    def update_vehicle_exit(vehicle_id):
        """Update vehicle exit time and calculate charges"""
        try:
            vehicle = Vehicle.get_by_id(vehicle_id)
            if not vehicle:
                raise Exception("Vehicle not found")
            
            if vehicle.get('status') != 'entered':
                raise Exception("Vehicle is not currently parked")
            
            # Calculate charges based on duration
            exit_time = datetime.now()
            entry_time = datetime.fromisoformat(str(vehicle.get('entryTime')))
            duration = (exit_time - entry_time).total_seconds() / 3600  # Convert to hours
            
            # Basic rate calculation (can be modified based on business rules)
            hourly_rate = 100  # Example rate
            charge = round(duration * hourly_rate, 2)  # Round to 2 decimal places
            
            # Update vehicle record
            vehicle_obj = Vehicle(
                vehicle_id=vehicle_id,
                vehicle_type=vehicle.get('vehicleType'),
                entry_time=entry_time,
                exit_time=exit_time,
                driver_name=vehicle.get('driverName'),
                mobile_number=vehicle.get('mobileNumber'),
                email=vehicle.get('email'),
                purpose_of_visit=vehicle.get('purposeOfVisit'),
                expected_duration_hours=vehicle.get('expectedDurationHours'),
                status='exited',
                qr_code=vehicle.get('qrCode'),
                charge=charge
            )
            
            return vehicle_obj.update()
        except Exception as e:
            raise Exception(f"Error updating vehicle exit: {str(e)}")

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

    @staticmethod
    def get_vehicle_by_plate(plate_number):
        """Get vehicle details by plate number (document ID) for exit detection"""
        try:
            # Get all active vehicles
            active_vehicles = Vehicle.get_active_vehicles()
            print(f"Searching for plate_number: '{plate_number}' (upper/strip: '{plate_number.strip().upper()}')")
            # Find vehicle with matching document ID (number plate)
            for vehicle in active_vehicles:
                vehicle_id = str(vehicle.get('id', '')).strip().upper()
                print(f"Checking vehicle id: '{vehicle_id}'")
                if vehicle_id == plate_number.strip().upper():
                    # Calculate current duration and charges
                    entry_time = datetime.fromisoformat(str(vehicle.get('entryTime')))
                    current_time = datetime.now()
                    duration = (current_time - entry_time).total_seconds() / 3600  # Convert to hours
                    hourly_rate = 100  # Example rate
                    current_charge = round(duration * hourly_rate, 2)
                    vehicle['currentDuration'] = round(duration, 2)
                    vehicle['currentCharge'] = current_charge
                    print(f"Vehicle found: {vehicle}")
                    return vehicle
            print("No matching vehicle found.")
            return None
        except Exception as e:
            print(f"Error in get_vehicle_by_plate: {e}")
            raise Exception(f"Error getting vehicle by plate number: {str(e)}")

    @staticmethod
    def confirm_vehicle_exit(plate_number):
        """Mark vehicle as exited after payment"""
        try:
            # Find the vehicle by plate number among active vehicles
            active_vehicles = Vehicle.get_active_vehicles()
            for vehicle in active_vehicles:
                if vehicle.get('plateNumber') == plate_number:
                    # Update status to 'exited' and set exit time
                    exit_time = datetime.now()
                    vehicle_obj = Vehicle(
                        vehicle_id=vehicle.get('id'),
                        vehicle_type=vehicle.get('vehicleType'),
                        entry_time=vehicle.get('entryTime'),
                        exit_time=exit_time,
                        driver_name=vehicle.get('driverName'),
                        mobile_number=vehicle.get('mobileNumber'),
                        email=vehicle.get('email'),
                        purpose_of_visit=vehicle.get('purposeOfVisit'),
                        expected_duration_hours=vehicle.get('expectedDurationHours'),
                        status='exited',
                        qr_code=vehicle.get('qrCode'),
                        charge=vehicle.get('currentCharge'),
                        plate_number=plate_number
                    )
                    return vehicle_obj.update()
            raise Exception('Vehicle not found or already exited')
        except Exception as e:
            raise Exception(f"Error confirming vehicle exit: {str(e)}") 