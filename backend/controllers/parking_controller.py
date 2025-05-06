from models.parking_slot import ParkingSlot

class ParkingSlotController:
    @staticmethod
    def add_slot(slot_data):
        """Create a new parking slot"""
        slot = ParkingSlot(
            slot_id=slot_data.get('slot_id'),
            slot_section=slot_data.get('slot_section'),
            slot_row=slot_data.get('slot_row'),
            slot_type=slot_data.get('slot_type'),
            slot_fee_per_hour=slot_data.get('slot_fee_per_hour')
        )
        return slot.save()
    
    @staticmethod
    def update_slot(slot_id, slot_data):
        """Update an existing parking slot"""
        slot = ParkingSlot(
            slot_id=slot_id,
            slot_section=slot_data.get('slot_section'),
            slot_row=slot_data.get('slot_row'),
            slot_type=slot_data.get('slot_type'),
            slot_fee_per_hour=slot_data.get('slot_fee_per_hour')
        )
        return slot.update()
    
    @staticmethod
    def delete_slot(slot_id):
        """Delete a parking slot"""
        slot = ParkingSlot(slot_id=slot_id)
        return slot.delete()
    
    @staticmethod
    def get_all_slots():
        """Get all parking slots"""
        return ParkingSlot.get_all()
    
    @staticmethod
    def get_slot_by_id(slot_id):
        """Get a specific parking slot by ID"""
        return ParkingSlot.get_by_id(slot_id)
