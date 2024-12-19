from flask import Blueprint, request, jsonify
from app.models import Job, db, user_jobs
from flask_login import current_user, login_required

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
        name=data.get('name'),
        location=data.get('location'),
        employer=data.get('employer'),
        pay=data.get('pay'),
        creatorId=current_user.id
    )

    db.session.add(new_job)
    db.session.commit()
    return jsonify(new_job.to_dict()), 200

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

    return jsonify(f'Job {job_id} added to User {current_user.id}')

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
        return jsonify(f'Job {job_id} removed from User {current_user.id}')
    
    else:
        return jsonify({"message": "Relation not found"}), 404
    

# Get Current User's Jobs
@job_routes.route('/current', methods=['GET'])
@login_required
def get_user_jobs():
    jobs = Job.query.filter_by(creatorId=current_user.id).all()
    jobs_data = []
    for job in jobs:
        job_info = {
            "id": job.id,
            "name": job.name,
            "location": job.location,
            "employer": job.employer,
            "pay": job.pay
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