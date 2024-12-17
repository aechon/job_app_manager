from flask_sqlalchemy import SQLAlchemy

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


db = SQLAlchemy()

# helper function for adding prefix to foreign key column references in production
def add_prefix_for_prod(attr):
    if environment == "production":
        return f"{SCHEMA}.{attr}"
    else:
        return attr


#join tables for many to many relationships
job_users = db.Table("job_users", db.metadata, 
    db.Column("user_id", db.ForeignKey("users.id"), primary_key=True),
    db.Column("job_id", db.ForeignKey("jobs.id"), primary_key=True))

contact_jobs = db.Table("contact_jobs", db.metadata,
    db.Column("contact_id", db.ForeignKey("contacts.id"), primary_key=True),
    db.Column("job_id", db.ForeignKey("jobs.id"), primary_key=True))