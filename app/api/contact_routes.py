import re
from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from app.models import Contact, db

contact_routes = Blueprint('contacts', __name__)

def validate_phone(phone):
    phone_regex = r"^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$"
    return re.match(phone_regex, phone)

def validate_email(email):
    email_regex =  r"[^@]+@[^@]+\.[^@]+"
    return re.match(email_regex, email)

# Get current user contacts
@contact_routes.route('/session', methods=['GET'])
@login_required
def get_all_contact():
    contacts = Contact.query.filter_by(userId=current_user.id).all()
    return jsonify([contact.to_dict() for contact in contacts])

# Create a new contact
@contact_routes.route('/new', methods=['POST'])
@login_required
def create_contact():
    data = request.get_json()
    if not all(k in data for k in (["name"])):
        return jsonify({"error": "Missing required data"}), 400

    errors = {}
    if len(data.get('name')) > 50:
        errors["name"] = "Name must be 50 characters or less"

    if data.get('company'):
        if len(data.get('company')) > 50:
            errors["company"] = "Company name must be 50 characters or less"

    if data.get('phone'):
        if not validate_phone(data.get('phone')):
            errors["phone"] = "Invalid phone number"
    
    if data.get('email'):
        if not validate_email(data.get('email')):
            errors["email"] = "Invalid email"

    if errors:
        return jsonify({"errors": errors}), 400 

    new_contact = Contact(
        name=data.get('name'),
        phone=data.get('phone'),
        email=data.get('email'),
        company=data.get('company'),
        userId=current_user.id
    )
    db.session.add(new_contact)
    db.session.commit()
    return jsonify(new_contact.to_dict()), 201

# Get contact details by id
@contact_routes.route('/<int:contact_id>', methods=['GET'])
@login_required
def get_contact_by_id(contact_id):
    contact = Contact.query.get(contact_id)

    if not contact:
        return jsonify({"message": "Contact not found"}), 404
    
    if contact.userId != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403
    
    return jsonify(contact.to_dict())

# Edit existing contact
@contact_routes.route('/<int:contact_id>', methods=['PUT'])
@login_required
def update_contact(contact_id):
    contact = Contact.query.get(contact_id)

    if not contact:
        return jsonify({"message": "Contact not found"}), 404
    
    if contact.userId != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    data = request.get_json()

    contact.name = data.get('name', contact.name)
    contact.phone = data.get('phone', contact.phone)
    contact.email = data.get('email', contact.email)
    contact.company = data.get('company', contact.company)
    db.session.commit()

    return jsonify(contact.to_dict())

# Delete a contact
@contact_routes.route('/<int:contact_id>', methods=['DELETE'])
@login_required
def delete_contact(contact_id):
    contact = Contact.query.get(contact_id)

    if not contact:
        return jsonify({"message": "Contact not found"}), 404
    
    if contact.userId != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403
    
    db.session.delete(contact)
    db.session.commit()
    return jsonify({"message": "Contact was successfully deleted"})