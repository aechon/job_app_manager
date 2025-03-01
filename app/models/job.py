from .db import db, contact_jobs, job_forms, user_jobs, environment, SCHEMA, add_prefix_for_prod


class Job(db.Model):
    __tablename__ = 'jobs'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(50))
    employer = db.Column(db.String(50), nullable=False)
    pay = db.Column(db.Integer)
    creatorId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    description = db.Column(db.String(1000))
    createdAt = db.Column(db.DateTime(timezone=True), server_default=db.func.now())
    updatedAt = db.Column(db.DateTime(timezone=True), onupdate=db.func.now())

    creator = db.relationship("User", back_populates="job")
    events = db.relationship("Event", lazy='dynamic', back_populates="job")
    contacts = db.relationship("Contact", secondary=contact_jobs, lazy='dynamic', back_populates="jobs")
    forms = db.relationship("Form", secondary=job_forms, lazy='dynamic', back_populates="jobs")
    users = db.relationship("User", secondary=user_jobs, back_populates="jobs")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'employer': self.employer,
            'pay': self.pay,
            'creatorId': self.creatorId,
            'description': self.description,
        }
