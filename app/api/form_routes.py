from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from app.models import Form, db, Job, user_jobs, User
import re

form_routes = Blueprint('forms', __name__)

# Get all forms of the current user
@form_routes.route('/session', methods=['GET'])
@login_required
def get_current_user_forms():
    forms = Form.query.filter_by(userId=current_user.id).all()

    # instead of throwing an error message here let's let the frontend decide what to do wtih an empty array of forms
    # if not forms:
    #     return jsonify({'message': 'No forms found for the current user.'}), 404
    return jsonify([form.to_dict() for form in forms]), 200

# Create a form
@form_routes.route('/new', methods=['POST'])
@login_required
def create_form():
    data = request.get_json()

    # Validate name and link
    if not all(k in data for k in ("name", "link")):
        return jsonify({"error": "Missing required data"}), 400
    # if not re.match(r'^[a-zA-Z\s]+$', data['name']):
    #     return jsonify({"error": "Name must contain only letters and spaces"}), 400
    if not re.match(r'^https?://.+', data['link']):
        return jsonify({"error": "Invalid link format"}), 400

    new_form = Form(
        name=data.get('name'),
        link=data.get('link'),
        userId=current_user.id
    )
    db.session.add(new_form)
    db.session.commit()
    return jsonify(new_form.to_dict()), 201

# Get form details by id
@form_routes.route('/<int:form_id>', methods=['GET'])
@login_required
def get_form_details(form_id):
    form = Form.query.filter_by(id=form_id, userId=current_user.id).first()
    if not form:
        return jsonify({"message": "Form couldn't be found"}), 404

    return jsonify(form.to_dict()), 201

# Get related forms from a Job id
@form_routes.route('/job/<int:job_id>', methods=['GET'])
@login_required
def get_job_forms(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"message": "Job couldn't be found"}), 404

    if job.creatorId != current_user.id and job not in Job.query.join(user_jobs, Job.id == user_jobs.c.job_id).join(User, user_jobs.c.user_id == User.id).filter_by(id=current_user.id).all():
        return jsonify({"error": "Unauthorized access"}), 403

    forms = job.forms.filter_by(userId=current_user.id) 
    return jsonify([form.to_dict() for form in forms]), 200

# Edit a form
@form_routes.route('/<int:form_id>', methods=['PUT'])
@login_required
def edit_form(form_id):
    form = Form.query.filter_by(id=form_id, userId=current_user.id).first()
    if not form:
        return jsonify({"message": "Form couldn't be found"}), 404

    data = request.get_json()

    # Validate name and link
    if 'name' in data and not re.match(r'^[a-zA-Z\s]+$', data['name']):
        return jsonify({"error": "Name must contain only letters and spaces"}), 400
    if 'link' in data and not re.match(r'^https?://.+', data['link']):
        return jsonify({"error": "Invalid link format"}), 400

    form.name = data.get('name', form.name)
    form.link = data.get('link', form.link)
    db.session.commit()
    return jsonify(form.to_dict()), 201

# Delete a form
@form_routes.route('/<int:form_id>', methods=['DELETE'])
@login_required
def delete_form(form_id):
    form = Form.query.filter_by(id=form_id, userId=current_user.id).first()
    if not form:
        return jsonify({"message": "Form couldn't be found"}), 404

    db.session.delete(form)
    db.session.commit()
    return jsonify({"message": "Successfully deleted"}), 200