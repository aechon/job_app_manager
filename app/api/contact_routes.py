from flask import Blueprint, request, jsonify
from app.models import Contact, db

contact_routes = Blueprint('contacts', __name__)

@contact_routes.route('/contact', methods=['POST'])
def create_contact():
    data = request.get_json()
    new_contact = Contact(
        name=data['name'],
        phone=data['phone'],
        email=data['email'],
        company=data['company'],
        user_id=data['user_id']
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

