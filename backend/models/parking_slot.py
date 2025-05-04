from firebase_admin import firestore

class ParkingSlot:
    def __init__(self, slot_id, slot_section, slot_row, slot_type, slot_fee_per_hour, **kwargs):
        self.slot_id = slot_id
        self.slot_section = slot_section
        self.slot_row = slot_row
        self.slot_type = slot_type
        self.slot_fee_per_hour = slot_fee_per_hour
        self.db = firestore.client()
        self.collection = self.db.collection('slots')
        self.document = self.collection.document(slot_id)
        
    def save(self):
        """Save the parking slot to Firestore"""
        data = {
            'slotId': self.slot_id,
            'slotSection': self.slot_section,
            'slotRow': self.slot_row,
            'slotType': self.slot_type,
            'slotFeePerHour': self.slot_fee_per_hour
        }
        self.document.set(data)
        return data
    
    @staticmethod
    def get_all():
        """Get all parking slots from Firestore"""
        db = firestore.client()
        slots_ref = db.collection('slots').stream()
        return [{**slot.to_dict()} for slot in slots_ref]

    @staticmethod
    def get_by_id(slot_id):
        """Get a parking slot by its ID from Firestore"""
        db = firestore.client()
        slot_ref = db.collection('slots').document(slot_id)
        slot_doc = slot_ref.get()
        
        if slot_doc.exists:
            return slot_doc.to_dict()
        else:
            raise ValueError(f"Parking slot with ID {slot_id} not found")
    
    @staticmethod
    def update(self, slot_data):
        """Update the parking slot in Firestore"""
        data = {
            'slotId': self.slot_id,
            'slotSection': slot_data.get('slot_section', self.slot_section),
            'slotRow': slot_data.get('slot_row', self.slot_row),
            'slotType': slot_data.get('slot_type', self.slot_type),
            'slotFeePerHour': slot_data.get('slot_fee_per_hour', self.slot_fee_per_hour)
        }
        self.document.set(data, merge=True)
        return data
    
    @staticmethod
    def delete(slot_id):
        """Delete a parking slot from Firestore"""
        db = firestore.client()
        slot_ref = db.collection('slots').document(slot_id)
        slot_doc = slot_ref.get()
        
        if slot_doc.exists:
            slot_ref.delete()
            return {"message": f"Parking slot with ID {slot_id} deleted successfully"}
        else:
            raise ValueError(f"Parking slot with ID {slot_id} not found")