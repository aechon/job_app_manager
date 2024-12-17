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
contact_jobs = db.Table("contact_jobs", db.metadata,
    db.Column("contact_id", db.ForeignKey("contacts.id"), primary_key=True),
    db.Column("job_id", db.ForeignKey("jobs.id"), primary_key=True))

job_forms = db.Table("job_forms", db.metadata,
    db.Column("job_id", db.ForeignKey("jobs.id"), primary_key=True),
    db.Column("form_id", db.ForeignKey("forms.id"), primary_key=True))