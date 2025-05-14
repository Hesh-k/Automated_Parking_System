from models.parking_slot import ParkingSlot

class ParkingController:
    @staticmethod
    def add_slot(slot_data):
        """Add a new parking slot"""
        slot = ParkingSlot(
            slot_id=slot_data.get('slotId'),
            status=slot_data.get('status', 'available'),
            floor=slot_data.get('floor', 1),
            location=slot_data.get('location')
        )
        return slot.save()
    
    @staticmethod
    def get_all_slots():
        """Get all parking slots"""
        return ParkingSlot.get_all() 