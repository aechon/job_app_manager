from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Form, Job, db

form_routes = Blueprint('forms', __name__)

# Get all forms of the current user
@form_routes.route('/forms/current', methods=['GET'])
@login_required
def get_current_user_forms():
    forms = Form.query.filter_by(user_id=current_user.id).all()
    return jsonify({"Forms": [{"id": form.id, "name": form.name, "link": form.link} for form in forms]}), 200

# Get related forms from a Job id
@form_routes.route('/jobs/<int:job_id>/forms', methods=['GET'])
@login_required
def get_job_forms(job_id):
    job = Job.query.filter_by(id=job_id, user_id=current_user.id).first()
    if not job:
        return jsonify({"message": "Job couldn't be found"}), 404

    forms = Form.query.filter_by(job_id=job_id).all()
    return jsonify({"Forms": [{"id": form.id, "name": form.name, "link": form.link} for form in forms]}), 200

# Create a new form
@form_routes.route('/forms/new', methods=['POST'])
@login_required
def create_form():
    data = request.get_json()
    name = data.get('name')
    link = data.get('link')

    if not name or not link:
        return jsonify({"message": "Bad data", "errors": {"name": "Name is required", "link": "Link is required"}}), 400

    new_form = Form(name=name, link=link, user_id=current_user.id)
    db.session.add(new_form)
    db.session.commit()

    return jsonify({
        "id": new_form.id,
        "name": new_form.name,
        "link": new_form.link,
        "createdAt": new_form.created_at,
        "updatedAt": new_form.updated_at
    }), 200

# Edit a form
@form_routes.route('/forms/<int:form_id>', methods=['PUT'])
@login_required
def edit_form(form_id):
    form = Form.query.filter_by(id=form_id, user_id=current_user.id).first()
    if not form:
        return jsonify({"message": "Form couldn't be found"}), 404

    data = request.get_json()
    name = data.get('name')
    link = data.get('link')

    if not name or not link:
        return jsonify({"message": "Bad data", "errors": {"name": "Name is required", "link": "Link is required"}}), 400

    form.name = name
    form.link = link
    db.session.commit()

    return jsonify({
        "name": form.name,
        "link": form.link,
        "createdAt": form.created_at,
        "updatedAt": form.updated_at
    }), 200

# Delete a form
@form_routes.route('/forms/<int:form_id>', methods=['DELETE'])
@login_required
def delete_form(form_id):
    form = Form.query.filter_by(id=form_id, user_id=current_user.id).first()
    if not form:
        return jsonify({"message": "Form couldn't be found"}), 404

    db.session.delete(form)
    db.session.commit()
    return jsonify({"message": "Successfully deleted"}), 200



# from flask import Blueprint, request, jsonify
# from flask_login import login_required, current_user

# from app.models import Form
# from app.models import db

# form_routes = Blueprint('forms', __name__)

# # Get all forms of the current user
# @form_routes.route('/api/forms/current', methods=['GET'])
# @login_required
# def get_current_user_forms():
#     forms = Form.query.filter_by(userId=current_user.id).all()
#     return jsonify({"Forms": [form.to_dict() for form in forms]}), 200

# # Get related forms from a Job id
# @form_routes.route('/api/jobs/<int:jobId>/forms', methods=['GET'])
# @login_required
# def get_job_forms(jobId):
#     # Assuming you have a Job model and a relationship set up
#     job = Job.query.filter_by(id=jobId, userId=current_user.id).first()
#     if not job:
#         return jsonify({"message": "Job couldn't be found"}), 404

#     forms = job.forms  # Assuming a relationship exists
#     return jsonify({"Forms": [form.to_dict() for form in forms]}), 200

# # Create a form
# @form_routes.route('/api/forms/new', methods=['POST'])
# @login_required
# def create_form():
#     data = request.get_json()
#     name = data.get('name')
#     link = data.get('link')

#     if not name or not link:
#         return jsonify({
#             "message": "Bad data",
#             "errors": {
#                 "name": "Name is required" if not name else None,
#                 "link": "Link is required" if not link else None,
#             }
#         }), 400

#     new_form = Form(name=name, link=link, userId=current_user.id)
#     db.session.add(new_form)
#     db.session.commit()

#     return jsonify({
#         "id": new_form.id,
#         "name": new_form.name,
#         "link": new_form.link,
#         "createdAt": new_form.createdAt,
#         "updatedAt": new_form.updatedAt
#     }), 200

# # Edit a form
# @form_routes.route('/api/forms/<int:formId>', methods=['PUT'])
# @login_required
# def edit_form(formId):
#     form = Form.query.filter_by(id=formId, userId=current_user.id).first()
#     if not form:
#         return jsonify({"message": "Form couldn't be found"}), 404

#     data = request.get_json()
#     name = data.get('name')
#     link = data.get('link')

#     if not name or not link:
#         return jsonify({
#             "message": "Bad data",
#             "errors": {
#                 "name": "Name is required" if not name else None,
#                 "link": "Link is required" if not link else None,
#             }
#         }), 400

#     form.name = name
#     form.link = link
#     db.session.commit()

#     return jsonify({
#         "name": form.name,
#         "link": form.link,
#         "createdAt": form.createdAt,
#         "updatedAt": form.updatedAt
#     }), 200

# # Delete a form
# @form_routes.route('/api/form/<int:formId>', methods=['DELETE'])
# @login_required
# def delete_form(formId):
#     form = Form.query.filter_by(id=formId, userId=current_user.id).first()
#     if not form:
#         return jsonify({"message": "Form couldn't be found"}), 404

#     db.session.delete(form)
#     db.session.commit()

#     return jsonify({"message": "Successfully deleted"}), 200