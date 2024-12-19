from flask import Blueprint, request, jsonify, session
from app.models import Job, db
from flask_login import current_user, login_required, logout_user
from datetime import datetime
from functools import wraps

job_routes = Blueprint('jobs', __name__)

# Get All Jobs 
@job_routes.route('/', methods=['GET'])
def get_all_job():
    jobs = Job.query.all()
    return jsonify([job.to_dict() for job in jobs])
    

# Create a New Job
@job_routes.route('/new', methods=['POST'])
@login_required
def create_job():
    data = request.get_json()
    if not all(k in data for k in ("name", "employer")):
        return jsonify({"error": "Missing required information"}), 400

    new_job = Job(
        name=data['name'],
        location=data['location'],
        employer=data['employer'],
        pay=data['pay'],
        creatorId=current_user.id
    )

    db.session.add(new_job)
    db.session.commit()
    return jsonify(new_job.to_dict()), 200

# Get Current User's Jobs
@job_routes.route('/current', methods=['GET'])
@login_required
def get_user_jobs():
    jobs = Job.query.filter_by(user.id=current_user.id).all()
    jobs_data = []
    for job in jobs:
        job_info = {
            "id": job.id,
            "name": job.name,
            "location": job.location,
            "employer": job.employer,
            "pay": job.pay,
            "interview": job.interview
        }
        jobs_data.append(job_info)

    return jsonify({"Jobs": jobs_data}), 200

# Get Job Details by ID 
@job_routes.route('/<int:job_id>', methods=['GET'])
@login_required
def get_job_by_id(job_id):
    job = Job.query.get(job_id)
    if job:
        return jsonify(job.to_dict())
    else:
        return jsonify({"message": "Job couldn't be found"}), 404

# Edit a Job
@job_routes.route('/<int:job_id>', methods=['PUT'])
@login_required
def edit_job(job_id):
    data = request.get_json()
    job = Job.query.get_or_404(job_id)
    if not job:
        return jsonify({"message": "Job couldn't be found"}), 404
    # if job.user_id != request.user_id:
        # return jsonify({"message": "Unauthorized to edit this job"}), 403

    job.name = data['name']
    job.location = data.get('location', job.location)
    job.employer = data['employer']
    job.pay = data.get('pay', job.pay)
    job.updatedAt = datetime.now()

    db.session.commit()

    return jsonify(job.to_dict()), 200

# Delete a Job 
@job_routes.route('/<int:job_id>', methods=['DELETE'])
@login_required
def delete_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"message": "Job couldn't be found"}), 404
    # if job.user_id != request.user_id:
    #     return jsonify({"message": "Unauthorized to delete this job"}), 403

    db.session.delete(job)
    db.session.commit()

    return jsonify({"message": "Successfully deleted"}), 200

