from .db import db, contact_jobs, environment, SCHEMA, add_prefix_for_prod


class Contact(db.Model):
    __tablename__ = 'contacts'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(13))
    email = db.Column(db.String(255))
    company = db.Column(db.String(50))
    userId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship("User", back_populates="contacts")
    jobs = db.relationship("Job", secondary=contact_jobs, back_populates="contacts")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
            'email': self.email,
            'company': self.company,
            'userId': self.userId
        }
