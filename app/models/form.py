from .db import db, job_forms, environment, SCHEMA, add_prefix_for_prod


class Form(db.Model):
    __tablename__ = 'forms'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    link = db.Column(db.String(255), nullable=False)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship("User", back_populates="forms")
    jobs = db.relationship("Job", secondary=job_forms, back_populates="users")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'link': self.link,
            'userId': self.userId
        }
