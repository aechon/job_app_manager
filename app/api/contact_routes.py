# from flask import Blueprint, request, jsonify
# from app.models import Contact, db
# from flask_login import login_required

# contact_routes = Blueprint('contacts', __name__)

# @contact_routes.route('/contact', methods=['POST'])
# @login_required
# def create_contact():
#     data = request.get_json()

#     # Ensure all required fields are provided
#     if not all(k in data for k in ("name", "phone", "email", "company", "userId")):
#         return jsonify({"error": "Missing required data"}), 400

#     new_contact = Contact(
#         name=data.get('name'),
#         phone=data.get('phone'),
#         email=data.get('email'),
#         company=data.get('company'),
#         userId=data.get('userId')
#     )
#     db.session.add(new_contact)
#     db.session.commit()
#     return jsonify(new_contact.to_dict()), 201


# @contact_routes.route('/contact', methods=['GET'])
# @login_required
# def get_all_contact():
#     contacts = Contact.query.all()
#     return jsonify([contact.to_dict() for contact in contacts])

# @contact_routes.route('/contact/<int:contact_id>', methods=['GET'])
# @login_required
# def get_contact_by_id(contact_id):
#     contact = Contact.query.get_or_404(contact_id)
#     return jsonify(contact.to_dict())

# @contact_routes.route('/contact/<int:contact_id>', methods=['PUT'])
# @login_required
# def update_contact(contact_id):
#     data = request.get_json()
#     contact = Contact.query.get_or_404(contact_id)
#     contact.name = data.get('name', contact.name)
#     contact.phone = data.get('phone', contact.phone)
#     contact.email = data.get('email', contact.email)
#     contact.company = data.get('company', contact.company)
#     db.session.commit()
#     return jsonify(contact.to_dict())

# @contact_routes.route('/contact/<int:contact_id>', methods=['DELETE'])
# @login_required
# def delete_contact(contact_id):
#     contact = Contact.query.get_or_404(contact_id)
#     db.session.delete(contact)
#     db.session.commit()
#     return jsonify({"message": "Contact was successfully deleted"})

from flask import Blueprint, request, jsonify, session
from flask_login import current_user, login_required, logout_user
from app.models import Contact, db

contact_routes = Blueprint('contacts', __name__)

@contact_routes.route('/contact', methods=['POST'])
@login_required
def create_contact():
    data = request.get_json()
    if not all(k in data for k in ("name", "phone", "email", "company")):
        return jsonify({"error": "Missing required data"}), 400

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

@contact_routes.route('/contact', methods=['GET'])
@login_required
def get_all_contact():
    contacts = Contact.query.filter_by(userId=current_user.id).all()
    return jsonify([contact.to_dict() for contact in contacts])

@contact_routes.route('/contact/<int:contact_id>', methods=['GET'])
@login_required
def get_contact_by_id(contact_id):
    contact = Contact.query.get_or_404(contact_id)
    if contact.userId != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403
    return jsonify(contact.to_dict())

@contact_routes.route('/contact/<int:contact_id>', methods=['PUT'])
@login_required
def update_contact(contact_id):
    data = request.get_json()
    contact = Contact.query.get_or_404(contact_id)
    if contact.userId != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403
    contact.name = data.get('name', contact.name)
    contact.phone = data.get('phone', contact.phone)
    contact.email = data.get('email', contact.email)
    contact.company = data.get('company', contact.company)
    db.session.commit()
    return jsonify(contact.to_dict())

@contact_routes.route('/contact/<int:contact_id>', methods=['DELETE'])
@login_required
def delete_contact(contact_id):
    contact = Contact.query.get_or_404(contact_id)
    if contact.userId != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403
    db.session.delete(contact)
    db.session.commit()
    return jsonify({"message": "Contact was successfully deleted"})
