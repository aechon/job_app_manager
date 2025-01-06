from flask import Blueprint, request, jsonify
from app.models import Job, db, user_jobs, User, job_forms, Form, contact_jobs, Contact
from flask_login import current_user, login_required

job_routes = Blueprint('jobs', __name__)

# Get All Jobs 
@job_routes.route('/', methods=['GET'])
def get_all_job():
    jobs = Job.query.all()
    return jsonify([job.to_dict() for job in jobs]), 200

# Create a New Job
@job_routes.route('/new', methods=['POST'])
@login_required
def create_job():
    data = request.get_json()
    if not all(k in data for k in ("name", "employer")):
        return jsonify({"error": "Missing required information"}), 400

    new_job = Job(
        name=data.get('name'),
        location=data.get('location'),
        employer=data.get('employer'),
        pay=data.get('pay'),
        creatorId=current_user.id
    )

    db.session.add(new_job)
    db.session.commit()
    return jsonify(new_job.to_dict()), 201

# Get Current User's Jobs
@job_routes.route('/session', methods=['GET'])
@login_required
def get_user_jobs():
    jobs = Job.query.filter_by(creatorId=current_user.id).all() + Job.query.join(user_jobs, Job.id == user_jobs.c.job_id).join(User, user_jobs.c.user_id == User.id).filter_by(id=current_user.id).all()

    return jsonify([job.to_dict() for job in jobs]), 200

# Get Job Details by ID
@job_routes.route('/<int:job_id>', methods=['GET'])
@login_required
def get_job_by_id(job_id):
    job = Job.query.get(job_id)

    if not job:
        return jsonify({"message": "Job couldn't be found"}), 404
    
    job_contacts = job.contacts.filter_by(userId=current_user.id) 
    job_events = job.events.filter_by(userId=current_user.id) 
    job_forms = job.forms.filter_by(userId=current_user.id) 

    job = job.to_dict()
    job.update({"Contacts": [job.to_dict() for job in job_contacts]})
    job.update({"Events": [job.to_dict() for job in job_events]})
    job.update({"Forms": [job.to_dict() for job in job_forms]})

    return jsonify(job), 200

# Edit a Job
@job_routes.route('/<int:job_id>', methods=['PUT'])
@login_required
def edit_job(job_id):
    data = request.get_json()
    job = Job.query.get(job_id)

    if not job:
        return jsonify({"message": "Job couldn't be found"}), 404
    
    if job.creatorId != current_user.id:
        return jsonify({"message": "Unauthorized to edit this job"}), 403
    
    if not all(k in data for k in ("name", "employer")):
        return jsonify({"error": "Missing required information"}), 400

    job.name=data.get('name')
    job.location=data.get('location')
    job.employer=data.get('employer')
    job.pay=data.get('pay')

    db.session.commit()

    return jsonify(job.to_dict()), 201

# Delete a Job 
@job_routes.route('/<int:job_id>', methods=['DELETE'])
@login_required
def delete_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"message": "Job couldn't be found"}), 404
    
    if job.creatorId != current_user.id:
        return jsonify({"message": "Unauthorized to delete this job"}), 403

    db.session.delete(job)
    db.session.commit()

    return jsonify({"message": "Successfully deleted"}), 200

# Create a relation between a job and user
@job_routes.route('/<int:job_id>/add', methods=['POST'])
@login_required
def add_job_to_user(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"message": "Job not found"}), 404
    
    if job.creatorId == current_user.id:
        return jsonify({"message": "User is already the creator of the job"}), 400
    
    if db.session.execute(db.select(user_jobs).where(user_jobs.c.user_id == current_user.id, user_jobs.c.job_id == job_id)).first():
        return jsonify({"message": "Job already added"}), 400

    db.session.execute(db.insert(user_jobs).values(user_id=current_user.id, job_id=job_id))
    db.session.commit()

    return jsonify(f'Job {job_id} added to User {current_user.id}'), 201

# Delete a relation between a job and user
@job_routes.route('/<int:job_id>/remove', methods=['DELETE'])
@login_required
def remove_job_to_user(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"message": "Job not found"}), 404
    
    if db.session.execute(db.select(user_jobs).where(user_jobs.c.user_id == current_user.id, user_jobs.c.job_id == job_id)).first():
        db.session.execute(db.delete(user_jobs).where(user_jobs.c.user_id == current_user.id, user_jobs.c.job_id == job_id))
        db.session.commit()
        return jsonify(f'Job {job_id} removed from User {current_user.id}'), 200
    
    else:
        return jsonify({"message": "Relation not found"}), 404

# Create a relation between a job and form
@job_routes.route('/<int:job_id>/forms/<int:form_id>', methods=['POST'])
@login_required
def add_form_to_job(job_id, form_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"message": "Job not found"}), 404
    
    form = Form.query.get(form_id)
    if not form:
        return jsonify({"message": "Form not found"}), 404

    if form.userId != current_user.id or (job.creatorId != current_user.id and job not in Job.query.join(user_jobs, Job.id == user_jobs.c.job_id).join(User, user_jobs.c.user_id == User.id).filter_by(id=current_user.id).all()):
        return jsonify({"error": "Unauthorized access"}), 403
    
    if db.session.execute(db.select(job_forms).where(job_forms.c.form_id == form_id, job_forms.c.job_id == job_id)).first():
        return jsonify({"message": "Form already added"}), 400

    db.session.execute(db.insert(job_forms).values(form_id=form_id, job_id=job_id))
    db.session.commit()

    return jsonify(f'Form {form_id} added to Job {job_id}'), 201

# Delete a relation between a job and form
@job_routes.route('/<int:job_id>/forms/<int:form_id>', methods=['DELETE'])
@login_required
def remove_form_from_job(job_id, form_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"message": "Job not found"}), 404
    
    form = Form.query.get(form_id)
    if not form:
        return jsonify({"message": "Form not found"}), 404
    
    if form.userId != current_user.id or (job.creatorId != current_user.id and job not in Job.query.join(user_jobs, Job.id == user_jobs.c.job_id).join(User, user_jobs.c.user_id == User.id).filter_by(id=current_user.id).all()):
        return jsonify({"error": "Unauthorized access"}), 403
    
    if db.session.execute(db.select(job_forms).where(job_forms.c.form_id == form_id, job_forms.c.job_id == job_id)).first():
        db.session.execute(db.delete(job_forms).where(job_forms.c.form_id == form_id, job_forms.c.job_id == job_id))
        db.session.commit()
        return jsonify(f'Form {form_id} removed from Job {job_id}'), 200
    
    else:
        return jsonify({"message": "Relation not found"}), 404
    
# Create a relation between a job and contact
@job_routes.route('/<int:job_id>/contacts/<int:contact_id>', methods=['POST'])
@login_required
def add_contact_to_job(job_id, contact_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"message": "Job not found"}), 404
    
    contact = Contact.query.get(contact_id)
    if not contact:
        return jsonify({"message": "Contact not found"}), 404

    if contact.userId != current_user.id or (job.creatorId != current_user.id and job not in Job.query.join(user_jobs, Job.id == user_jobs.c.job_id).join(User, user_jobs.c.user_id == User.id).filter_by(id=current_user.id).all()):
        return jsonify({"error": "Unauthorized access"}), 403
    
    if db.session.execute(db.select(contact_jobs).where(contact_jobs.c.contact_id == contact_id, contact_jobs.c.job_id == job_id)).first():
        return jsonify({"message": "Contact already added"}), 400

    db.session.execute(db.insert(contact_jobs).values(contact_id=contact_id, job_id=job_id))
    db.session.commit()

    return jsonify(f'Contact {contact_id} added to Job {job_id}'), 201

# Delete a relation between a job and contact
@job_routes.route('/<int:job_id>/contacts/<int:contact_id>', methods=['DELETE'])
@login_required
def remove_contact_from_job(job_id, contact_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"message": "Job not found"}), 404
    
    contact = Contact.query.get(contact_id)
    if not contact:
        return jsonify({"message": "Contact not found"}), 404
    
    if contact.userId != current_user.id or (job.creatorId != current_user.id and job not in Job.query.join(user_jobs, Job.id == user_jobs.c.job_id).join(User, user_jobs.c.user_id == User.id).filter_by(id=current_user.id).all()):
        return jsonify({"error": "Unauthorized access"}), 403
    
    if db.session.execute(db.select(contact_jobs).where(contact_jobs.c.contact_id == contact_id, contact_jobs.c.job_id == job_id)).first():
        db.session.execute(db.delete(contact_jobs).where(contact_jobs.c.contact_id == contact_id, contact_jobs.c.job_id == job_id))
        db.session.commit()
        return jsonify(f'Contact {contact_id} removed from Job {job_id}'), 200
    
    else:
        return jsonify({"message": "Relation not found"}), 404