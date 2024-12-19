
from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from app.models import Form, db

form_routes = Blueprint('forms', __name__)

# Get all forms of the current user
@form_routes.route('/current', methods=['GET'])
@login_required
def get_current_user_forms():
    print(f"Current user ID: {current_user.id}<<=================")  # Removeeeeeee meeeeeeeeeeeeeeeeee debuggg
    forms = Form.query.filter_by(userId=current_user.id).all()
    print(f"Forms found: {forms}<<=================")  # Removeeeeeee meeeeeeeeeeeeeeeeee debuggg
    if not forms:
        return jsonify({'message': 'No forms found for the current user.'}), 404
    return jsonify([form.to_dict() for form in forms]), 200

#testing seed
@form_routes.route('/all', methods=['GET'])
def get_all_forms():
    forms = Form.query.all()
    return jsonify([form.to_dict() for form in forms]), 200

# Get related forms from a Job id
@form_routes.route('/jobs/<int:jobId>/forms', methods=['GET'])
@login_required
def get_job_forms(jobId):
    print("hello") # REMOVE MEEEEEEEEE <<=================
    job = Job.query.filter_by(id=jobId, userId=current_user.id).first()
    if not job:
        return jsonify({"message": "Job couldn't be found"}), 404

    forms = job.forms  
    return jsonify([form.to_dict() for form in forms]), 200










# Create a form
@form_routes.route('/new', methods=['POST'])
@login_required
def create_form():
    data = request.get_json()
    if not all(k in data for k in ("name", "link")):
        return jsonify({"error": "Missing required data"}), 400

    new_form = Form(
        name=data.get('name'),
        link=data.get('link'),
        userId=current_user.id
    )
    db.session.add(new_form)
    db.session.commit()
    return jsonify(new_form.to_dict()), 201

# Edit a form
@form_routes.route('/<int:formId>', methods=['PUT'])
@login_required
def edit_form(formId):
    form = Form.query.filter_by(id=formId, userId=current_user.id).first()
    if not form:
        return jsonify({"message": "Form couldn't be found"}), 404

    data = request.get_json()
    form.name = data.get('name', form.name)
    form.link = data.get('link', form.link)
    db.session.commit()
    return jsonify(form.to_dict()), 200

# Delete a form
@form_routes.route('/<int:formId>', methods=['DELETE'])
@login_required
def delete_form(formId):
    form = Form.query.filter_by(id=formId, userId=current_user.id).first()
    if not form:
        return jsonify({"message": "Form couldn't be found"}), 404

    db.session.delete(form)
    db.session.commit()
    return jsonify({"message": "Successfully deleted"}), 200