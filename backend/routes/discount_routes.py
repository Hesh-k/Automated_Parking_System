from flask import Blueprint, jsonify, request
from controllers.discount_controller import DiscountController

discount_bp = Blueprint('discount', __name__)

@discount_bp.route('/discounts', methods=['GET'])
def get_discounts():
    """Get all discounts"""
    discounts = DiscountController.get_all_discounts()
    return jsonify(discounts)

@discount_bp.route('/discounts/<discount_id>', methods=['GET'])
def get_discount(discount_id):
    """Get a specific discount by ID"""
    discount = DiscountController.get_discount_by_id(discount_id)
    if not discount:
        return jsonify({"error": "Discount not found"}), 404
    return jsonify(discount)

@discount_bp.route('/discounts', methods=['POST'])
def create_discount():
    """Create a new discount"""
    data = request.json
    try:
        discount = DiscountController.create_discount(data)
        return jsonify({"message": "Discount created successfully", "data": discount}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@discount_bp.route('/discounts/<discount_id>', methods=['PUT'])
def update_discount(discount_id):
    """Update an existing discount"""
    data = request.json
    try:
        discount = DiscountController.update_discount(discount_id, data)
        return jsonify({"message": "Discount updated successfully", "data": discount})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@discount_bp.route('/discounts/<discount_id>', methods=['DELETE'])
def delete_discount(discount_id):
    """Delete a discount"""
    try:
        DiscountController.delete_discount(discount_id)
        return jsonify({"message": "Discount deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400 