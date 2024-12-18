from flask import Blueprint, request, jsonify
from app.models import Event, db
from flask_login import login_required, current_user

event_routes = Blueprint('events', __name__)



@event_routes.route('/session', methods=['GET'])
def get_schedule():
    return jsonify('test get schedule')


@event_routes.route('/new', methods=['POST'])
@login_required
def create_schedule_event():
    
    return jsonify(f'test create new event: {current_user}')

@event_routes.route('/<int:event_id>', methods=['PUT'])
def edit_schedule_event(event_id):
    return jsonify('test update event')

@event_routes.route('/<int:event_id>', methods=['DELETE'])
def delete_schedule_event(event_id):
    return jsonify('test delete event')
