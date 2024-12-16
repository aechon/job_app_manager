from .db import db, environment, SCHEMA, add_prefix_for_prod


class Contact(db.Model):
    __tablename__ = 'contacts'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(13))
    email = db.Column(db.String(255))
    company = db.Column(db.String(50))
    userId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
            'email': self.email,
            'company': self.company,
            'userId': self.userId
        }
