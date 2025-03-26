class ParkingModel:
    def __init__(self):
        self.free_spaces = 0
        self.total_spaces = 0

    def update_spaces(self, free, total):
        """Update parking space counts."""
        self.free_spaces = free
        self.total_spaces = total

    def get_free_spaces(self):
        """Return number of free spaces."""
        return self.free_spaces

    def get_occupied_spaces(self):
        """Return number of occupied spaces."""
        return self.total_spaces - self.free_spaces

# Singleton instance
parking_model = ParkingModel()