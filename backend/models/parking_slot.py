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
