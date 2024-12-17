from .db import db, contact_jobs, job_forms, environment, SCHEMA, add_prefix_for_prod


class Job(db.Model):
    __tablename__ = 'jobs'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(50))
    employer = db.Column(db.String(50), nullable=False)
    pay = db.Column(db.Integer)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship("User", back_populates="jobs")
    events = db.relationship("Event", back_populates="job")
    contacts = db.relationship("Contact", secondary=contact_jobs, back_populates="jobs")
    forms = db.relationship("Form", secondary=job_forms, back_populates="jobs")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'employer': self.employer,
            'pay': self.pay,
            'userId': self.userId
        }
