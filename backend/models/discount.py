from firebase_admin import firestore
from datetime import datetime

class Discount:
    def __init__(self, discount_id=None, name=None, type=None, condition=None, 
                 reward=None, status="active", description=None, usage_count=0):
        self.discount_id = discount_id
        self.name = name
        self.type = type  # frequency, timeframe, timing
        self.condition = condition
        self.reward = reward
        self.status = status
        self.description = description
        self.usage_count = usage_count
        self.created_at = datetime.now()
        self.db = firestore.client()
        self.collection = self.db.collection('discounts')
        
    def save(self):
        """Save the discount to Firestore"""
        if not self.discount_id:
            # Generate a new ID if creating new discount
            self.discount_id = self.collection.document().id
            
        data = {
            'id': self.discount_id,
            'name': self.name,
            'type': self.type,
            'condition': self.condition,
            'reward': self.reward,
            'status': self.status,
            'description': self.description,
            'usageCount': self.usage_count,
            'createdAt': self.created_at
        }
        
        self.collection.document(self.discount_id).set(data)
        return data
    
    def update(self):
        """Update the discount in Firestore"""
        if not self.discount_id:
            raise ValueError("Discount ID is required for update")
            
        data = {
            'name': self.name,
            'type': self.type,
            'condition': self.condition,
            'reward': self.reward,
            'status': self.status,
            'description': self.description
        }
        
        self.collection.document(self.discount_id).update(data)
        return data
    
    def delete(self):
        """Delete the discount from Firestore"""
        if not self.discount_id:
            raise ValueError("Discount ID is required for delete")
            
        self.collection.document(self.discount_id).delete()
        return True
    
    @staticmethod
    def get_all():
        """Get all discounts from Firestore"""
        db = firestore.client()
        discounts_ref = db.collection('discounts').stream()
        return [{**discount.to_dict()} for discount in discounts_ref]
    
    @staticmethod
    def get_by_id(discount_id):
        """Get a specific discount by ID"""
        db = firestore.client()
        discount_doc = db.collection('discounts').document(discount_id).get()
        if discount_doc.exists:
            return discount_doc.to_dict()
        return None 