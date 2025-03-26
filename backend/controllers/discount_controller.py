from models.discount import Discount

class DiscountController:
    @staticmethod
    def create_discount(discount_data):
        """Create a new discount"""
        discount = Discount(
            name=discount_data.get('name'),
            type=discount_data.get('type'),
            condition=discount_data.get('condition'),
            reward=discount_data.get('reward'),
            description=discount_data.get('description'),
            status=discount_data.get('status', 'active')
        )
        return discount.save()
    
    @staticmethod
    def update_discount(discount_id, discount_data):
        """Update an existing discount"""
        discount = Discount(
            discount_id=discount_id,
            name=discount_data.get('name'),
            type=discount_data.get('type'),
            condition=discount_data.get('condition'),
            reward=discount_data.get('reward'),
            description=discount_data.get('description'),
            status=discount_data.get('status')
        )
        return discount.update()
    
    @staticmethod
    def delete_discount(discount_id):
        """Delete a discount"""
        discount = Discount(discount_id=discount_id)
        return discount.delete()
    
    @staticmethod
    def get_all_discounts():
        """Get all discounts"""
        return Discount.get_all()
    
    @staticmethod
    def get_discount_by_id(discount_id):
        """Get a specific discount by ID"""
        return Discount.get_by_id(discount_id) 