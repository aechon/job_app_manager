from .db import db, environment, SCHEMA, add_prefix_for_prod


class Event(db.Model):
    __tablename__ = 'events'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    start = db.Column(db.DateTime, nullable=False)
    type = db.Column(db.String(50))
    interviewer = db.Column(db.String(50))
    duration = db.Column(db.Integer, nullable=False)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    jobId = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    contactId = db.Column(db.Integer, db.ForeignKey('contacts.id'))

    user = db.relationship("User", back_populates="events")
    job = db.relationship("Job", back_populates="events")
    contact = db.relationship("Contact", back_populates="events")

    def to_dict(self):
        return {
            'id': self.id,
            'start': self.start,
            'type': self.type,
            'interviewer': self.interviewer,
            'duration': self.duration,
            'userId': self.userId,
            'jobId': self.jobId,
            'contactId': self.contactId
        }
