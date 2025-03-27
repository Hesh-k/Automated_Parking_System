from firebase_admin import firestore

class ParkingSlot:
    def __init__(self, slot_id, status="available", floor=1, location=None, **kwargs):
        self.slot_id = slot_id
        self.status = status
        self.floor = floor
        self.location = location
        self.db = firestore.client()
        self.collection = self.db.collection('slots')
        self.document = self.collection.document(slot_id)
        
    def save(self):
        """Save the parking slot to Firestore"""
        data = {
            'slotId': self.slot_id,
            'status': self.status,
            'floor': self.floor,
            'location': self.location
        }
        self.document.set(data)
        return data
    
    @staticmethod
    def get_all():
        """Get all parking slots from Firestore"""
        db = firestore.client()
        slots_ref = db.collection('slots').stream()
        return [{**slot.to_dict()} for slot in slots_ref] 