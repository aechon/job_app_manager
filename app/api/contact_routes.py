import re
from flask import Blueprint, request, jsonify
from app.models import Contact, db

contact_routes = Blueprint('contacts', __name__)

def validate_phone(phone):
    phone_regex = r"^\+?1?\d{9,15}$"
    return re.match(phone_regex, phone)


def validate_email(email):
    email_regex =  r"[^@]+@[^@]+\.[^@]+"
    return re.match(email_regex, email)


@contact_routes.route('/contact', methods=['POST'])
def create_contact():
    data = request.get_json()

    # Ensure all required fields are provided
    if not all(k in data for k in ("name", "phone", "email", "company", "userId")):
        return jsonify({"error": "Missing required data"}), 400
    
    name = data["name"]
    if len(name) > 50:
        return jsonify({"error": "name must be 50 characters or less"})
    
    company = data["company"]
    if len(company) > 50:
        return jsonify({"error": "name must be 50 characters or less"})
    
    if not validate_phone(data['phone']):
        return jsonify({"error": "invalid phone number"})
    
    if not validate_email(data['email']):
        return jsonify({"error": "invalid email"})

    new_contact = Contact(
        name=name,
        phone=data.get('phone'),
        email=data.get('email'),
        company=company,
        userId=data.get('userId')
    )
    db.session.add(new_contact)
    db.session.commit()
    return jsonify(new_contact.to_dict()), 201


@contact_routes.route('/contact', methods=['GET'])
def get_all_contact():
    contacts = Contact.query.all()
    return jsonify([contact.to_dict() for contact in contacts])

@contact_routes.route('/contact/<int:contact_id>', methods=['GET'])
def get_contact_by_id(contact_id):
    contact = Contact.query.get_or_404(contact_id)
    return jsonify(contact.to_dict())

@contact_routes.route('/contact/<int:contact_id>', methods=['PUT'])
def update_contact(contact_id):
    data = request.get_json()
    contact = Contact.query.get_or_404(contact_id)
    contact.name = data.get('name', contact.name)
    contact.phone = data.get('phone', contact.phone)
    contact.email = data.get('email', contact.email)
    contact.company = data.get('company', contact.company)
    db.session.commit()
    return jsonify(contact.to_dict())

@contact_routes.route('/contact/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    contact = Contact.query.get_or_404(contact_id)
    db.session.delete(contact)
    db.session.commit()
    return jsonify({"message": "Contact was successfully deleted"})

