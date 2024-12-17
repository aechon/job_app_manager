from flask import Flask, request, jsonify
from datetime import datetime
from functools import wraps

app = Flask(__name__)

jobs_db = []

def requires_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or auth_header != 'Bearer valid-token':
            return jsonify({"message": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated_function

# Get All Jobs
@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    return jsonify({"Jobs": jobs_data}), 200

if __name__ == "__main__":
    app.run(debug=True)

# Create A Job
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

    job = {
        "name": data['name'],
        "location": data.get('location', ''),
        "employer": data['employer'],
        "pay": data.get('pay', ''),
        "createdAt": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        "updatedAt": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }

    jobs_db.append(job)

    return jsonify(job), 200

if __name__ == '__main__':
    app.run(debug=True)



# Get Current Users Jobs

@app.route('/api/jobs/current', methods=['GET'])
@requires_auth
def get_user_jobs():
    user_jobs = [job for job in jobs_db if job['user_id'] == request.user_id]


    response = {
        "Jobs": []
    }

    for job in user_jobs:
        job_details = {
            "id": job["id"],
            "name": job["name"],
            "location": job["location"],
            "employer": job["employer"],
            "pay": job["pay"],
            "interview": job["interview"],
        }