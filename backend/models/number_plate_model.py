from datetime import datetime

class NumberPlateModel:
    def __init__(self):
        self.current_plate = None
        self.timestamp = None
        self.processed_numbers = set()

    def update_plate(self, plate):
        """Update the current plate if new and valid."""
        if plate and plate not in self.processed_numbers:
            self.current_plate = plate
            self.timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            self.processed_numbers.add(plate)
            with open('car_plate_data.txt', 'a') as file:
                file.write(f"{plate}\t{self.timestamp}\n")

    def get_plate_data(self):
        """Return current plate and timestamp."""
        return {"number_plate": self.current_plate, "timestamp": self.timestamp}

# Singleton instance
number_plate_model = NumberPlateModel()