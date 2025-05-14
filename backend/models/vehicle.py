from firebase_admin import firestore
from datetime import datetime

class Vehicle:
    def __init__(self, vehicle_id=None, vehicle_type=None, entry_time=None, 
                 exit_time=None, driver_name=None, mobile_number=None, 
                 email=None, purpose_of_visit=None, expected_duration_hours=None,
                 status="entered", qr_code=None, charge=0, plate_number=None, payment_status=None):
        self.vehicle_id = vehicle_id
        self.vehicle_type = vehicle_type
        self.entry_time = entry_time or datetime.now()
        self.exit_time = exit_time
        self.driver_name = driver_name
        self.mobile_number = mobile_number
        self.email = email
        self.purpose_of_visit = purpose_of_visit
        self.expected_duration_hours = expected_duration_hours
        self.status = status
        self.qr_code = qr_code
        self.charge = charge
        self.plate_number = plate_number
        self.payment_status = payment_status or 'unpaid'
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.db = firestore.client()
        self.collection = self.db.collection('vehicles')
        
    def save(self):
        """Save the vehicle record to Firestore"""
        if not self.vehicle_id:
            self.vehicle_id = self.collection.document().id
            
        data = {
            'id': self.vehicle_id,
            'vehicleType': self.vehicle_type,
            'entryTime': self.entry_time,
            'exitTime': self.exit_time,
            'driverName': self.driver_name,
            'mobileNumber': self.mobile_number,
            'email': self.email,
            'purposeOfVisit': self.purpose_of_visit,
            'expectedDurationHours': self.expected_duration_hours,
            'status': self.status,
            'qrCode': self.qr_code,
            'charge': self.charge,
            'plateNumber': self.plate_number,
            'paymentStatus': self.payment_status,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }
        
        self.collection.document(self.vehicle_id).set(data)
        return data
    
    def update(self):
        """Update the vehicle record in Firestore"""
        if not self.vehicle_id:
            raise ValueError("Vehicle ID is required for update")
            
        self.updated_at = datetime.now()
        data = {
            'vehicleType': self.vehicle_type,
            'entryTime': self.entry_time,
            'exitTime': self.exit_time,
            'driverName': self.driver_name,
            'mobileNumber': self.mobile_number,
            'email': self.email,
            'purposeOfVisit': self.purpose_of_visit,
            'expectedDurationHours': self.expected_duration_hours,
            'status': self.status,
            'qrCode': self.qr_code,
            'charge': self.charge,
            'plateNumber': self.plate_number,
            'paymentStatus': self.payment_status,
            'updatedAt': self.updated_at
        }
        
        self.collection.document(self.vehicle_id).update(data)
        return data
    
    def delete(self):
        """Delete the vehicle record from Firestore"""
        if not self.vehicle_id:
            raise ValueError("Vehicle ID is required for delete")
            
        self.collection.document(self.vehicle_id).delete()
        return True
    
    @staticmethod
    def get_all():
        """Get all vehicle records from Firestore"""
        db = firestore.client()
        vehicles_ref = db.collection('vehicles').stream()
        return [{**vehicle.to_dict()} for vehicle in vehicles_ref]
    
    @staticmethod
    def get_by_id(vehicle_id):
        """Get a specific vehicle record by ID or plate number"""
        db = firestore.client()
        # First try direct document lookup
        vehicle_doc = db.collection('vehicles').document(vehicle_id).get()
        if vehicle_doc.exists:
            return vehicle_doc.to_dict()
        
        # If not found, try searching by plate number in all documents
        vehicles_ref = db.collection('vehicles').where('id', '==', vehicle_id).limit(1).stream()
        for vehicle in vehicles_ref:
            return vehicle.to_dict()
            
        return None

    @staticmethod
    def get_active_vehicles():
        """Get all vehicles that are currently in the parking lot"""
        db = firestore.client()
        vehicles_ref = db.collection('vehicles').where('status', '==', 'entered').stream()
        return [{**vehicle.to_dict()} for vehicle in vehicles_ref] 