from .db import db, environment, SCHEMA, add_prefix_for_prod


class Form(db.Model):
    __tablename__ = 'forms'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    link = db.Column(db.String(255), nullable=False)
    userId = db.Column(db.Intger, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship("User", back_populates="forms")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'link': self.link,
            'userId': self.userId
        }
