from flask import Blueprint, request, jsonify
from app.models import Event, db, User, user_jobs, Job, Contact
from flask_login import login_required, current_user
from datetime import datetime, timedelta

event_routes = Blueprint('events', __name__)

def validate_event(data, eventId=None):
    errors = {}

    job = Job.query.get(data.get('jobId'))
    if job.creatorId != current_user.id and job not in Job.query.join(user_jobs, Job.id == user_jobs.c.job_id).join(User, user_jobs.c.user_id == User.id).filter_by(id=current_user.id).all():
        errors['jobId'] = 'User does not have this job id'

    if type(data.get('duration')) is not int:
        errors['duration'] = 'Must be an integer'
    elif data.get('duration') < 1:
        errors['duration'] = 'Must be a positive integer'

    if datetime.strptime(data.get('start'),"%Y-%m-%d %H:%M:%S") < datetime.now():
        errors['start'] = 'Event start time cannot be in the past'
    
    schedule = Event.query.filter_by(userId=current_user.id).except_(Event.query.filter_by(id=eventId))
    events = [event.to_dict() for event in schedule]
    start = datetime.strptime(data.get('start'),"%Y-%m-%d %H:%M:%S")
    end = datetime.strptime(data.get('start'),"%Y-%m-%d %H:%M:%S").__add__(timedelta(minutes=data.get('duration')))
    for event in events:
        if (start >= event.get('start') and start <= event.get('start').__add__(timedelta(minutes=event.get('duration')))) or (end >= event.get('start') and end <= event.get('start').__add__(timedelta(minutes=event.get('duration')))):
            errors['message'] = 'Conflict with existing event'
            break

    if errors:
        return errors


# Gets all the events of the currently logged in user
@event_routes.route('/session', methods=['GET'])
@login_required
def get_schedule():
    schedule = Event.query.filter_by(userId=current_user.id).all()
    return jsonify([event.to_dict() for event in schedule]), 200

# Creates a new event in the database
@event_routes.route('/new', methods=['POST'])
@login_required
def create_schedule_event():
    data = request.get_json()

    if not all(k in data for k in ("start", "duration", "jobId")):
        return jsonify({"error": "Missing required data"}), 400
    
    errors = validate_event(data)

    if (errors):
        return jsonify(errors), 400

    new_event = Event(
        start=datetime.strptime(data.get('start'),"%Y-%m-%d %H:%M:%S"),
        duration=data.get('duration'),
        type=data.get('type'),
        interviewer=data.get('interviewer'),
        jobId=data.get('jobId'),
        contactId=data.get('contactId'),
        userId=current_user.id
    )

    db.session.add(new_event)
    db.session.commit()
    return jsonify(new_event.to_dict()), 201

# Gets the details of an event by id
@event_routes.route('/<int:event_id>', methods=['GET'])
@login_required
def get_event_details(event_id):
    event = Event.query.get(event_id)

    if not event:
        return jsonify({"message": "Event not found"}), 404
    
    if event.userId != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403
    
    event = event.to_dict()
    event_contact = Contact.query.get(event['contactId'])
    if event_contact:
        event.update({"Contact": event_contact.to_dict()})

    return jsonify(event)

# Updates and existing event by id
@event_routes.route('/<int:event_id>', methods=['PUT'])
@login_required
def edit_schedule_event(event_id):
    event = Event.query.get(event_id)

    if not event:
        return jsonify({"message": "Event not found"}), 404

    if event.userId != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403
    
    data = request.get_json()

    if not all(k in data for k in ("start", "duration")):
        return jsonify({"error": "Missing required data"}), 400
    
    errors = validate_event(data, event.id)

    if (errors):
        return jsonify(errors), 400
    
    event.start=datetime.strptime(data.get('start'),"%Y-%m-%d %H:%M:%S")
    event.duration=data.get('duration')
    event.type=data.get('type')
    event.interviewer=data.get('interviewer')
    event.contactId=data.get('contactId')
    db.session.commit()

    return jsonify(event.to_dict()), 201

# Delete an event
@event_routes.route('/<int:event_id>', methods=['DELETE'])
@login_required
def delete_schedule_event(event_id):
    event = Event.query.get(event_id)

    if not event:
        return jsonify({"message": "Event not found"}), 404

    if event.userId != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403
    
    db.session.delete(event)
    db.session.commit()
    return jsonify({"message": "Event was successfully deleted"})

# Get events related to a job id
@event_routes.route('/job/<int:job_id>', methods=['GET'])
@login_required
def get_job_events(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"message": "Job not found"}), 404
    
    if job.creatorId != current_user.id and job not in Job.query.join(user_jobs, Job.id == user_jobs.c.job_id).join(User, user_jobs.c.user_id == User.id).filter_by(id=current_user.id).all():
        return jsonify({"error": "Unauthorized access"}), 403

    events = Event.query.filter_by(jobId=job_id, userId=current_user.id)

    return jsonify([event.to_dict() for event in events]), 200