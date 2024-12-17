from flask import Flask, request, jsonify
from datetime import datetime
from functools import wraps
from app.models import User, db


app = Flask(__name__)



def requires_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"message": "Unauthorized"}), 401
        token = auth_header.split(" ")[1]
        user = User.query.filter_by(token=token).first()
        if not user:
            return jsonify({"message": "Unauthorized"}), 401
        request.user_id = user.id
        return f(*args, **kwargs)
    return decorated_function


# API Routes

# Get All Jobs 
@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    jobs = Job.query.all()
    jobs_data = []
    for job in jobs:
        jobs_data.append({
            "id": job.id,
            "name": job.name,
            "location": job.location,
            "employer": job.employer,
            "pay": job.pay
        })
    return jsonify({"Jobs": jobs_data}), 200

# Create a New Job
@app.route('/api/jobs/new', methods=['POST'])
@requires_auth
def create_job():
    data = request.get_json()

    errors = {}
    if 'name' not in data or not data['name']:
        errors['name'] = "Name is required"
    if 'employer' not in data or not data['employer']:
        errors['employer'] = "Employer is required"

    if errors:
        return jsonify({
            "message": "Bad data",
            "errors": errors
        }), 400

    job = Job(
        name=data['name'],
        location=data.get('location', ''),
        employer=data['employer'],
        pay=data.get('pay', ''),
        interview=data.get('interview', False),
        user_id=request.user_id,
        createdAt=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        updatedAt=datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    )

    db.session.add(job)
    db.session.commit()

    return jsonify({
        "id": job.id,
        "name": job.name,
        "location": job.location,
        "employer": job.employer,
        "pay": job.pay,
        "createdAt": job.createdAt,
        "updatedAt": job.updatedAt
    }), 200

# Get Current User's Jobs
@app.route('/api/jobs/current', methods=['GET'])
@requires_auth
def get_user_jobs():
    user_jobs = Job.query.filter_by(user_id=request.user_id).all()

    response = {
        "Jobs": [{
            "id": job.id,
            "name": job.name,
            "location": job.location,
            "employer": job.employer,
            "pay": job.pay,
            "interview": job.interview,
            "contacts": [{
                "id": contact.id,
                "name": contact.name,
                "phone": contact.phone,
                "email": contact.email,
                "company": contact.company
            } for contact in job.contacts],
            "Interviews": job.interviews  
        } for job in user_jobs]
    }

    return jsonify(response), 200

# Get Job Details by ID 
@app.route('/api/jobs/<int:job_id>', methods=['GET'])
def get_job_by_id(job_id):
    job = Job.query.get(job_id)
    if job:
        return jsonify({
            "id": job.id,
            "name": job.name,
            "location": job.location,
            "employer": job.employer,
            "pay": job.pay
        }), 200
    else:
        return jsonify({"message": "Job couldn't be found"}), 404

# Edit a Job
@app.route('/api/jobs/<int:job_id>', methods=['PUT'])
@requires_auth
def edit_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"message": "Job couldn't be found"}), 404
    if job.user_id != request.user_id:
        return jsonify({"message": "Unauthorized to edit this job"}), 403

    data = request.get_json()

    errors = {}
    if 'name' not in data or not data['name']:
        errors['name'] = "Name is required"
    if 'employer' not in data or not data['employer']:
        errors['employer'] = "Employer is required"

    if errors:
        return jsonify({
            "message": "Bad data",
            "errors": errors
        }), 400

    job.name = data['name']
    job.location = data.get('location', job.location)
    job.employer = data['employer']
    job.pay = data.get('pay', job.pay)
    job.updatedAt = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    db.session.commit()

    return jsonify({
        "name": job.name,
        "location": job.location,
        "employer": job.employer,
        "pay": job.pay,
        "createdAt": job.createdAt,
        "updatedAt": job.updatedAt
    }), 200

# Delete a Job 
@app.route('/api/jobs/<int:job_id>', methods=['DELETE'])
@requires_auth
def delete_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"message": "Job couldn't be found"}), 404
    if job.user_id != request.user_id:
        return jsonify({"message": "Unauthorized to delete this job"}), 403

    db.session.delete(job)
    db.session.commit()

    return jsonify({"message": "Successfully deleted"}), 200

if __name__ == '__main__':
    app.run(debug=True)