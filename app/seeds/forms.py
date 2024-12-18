from app.models import db, Form, environment, SCHEMA
from sqlalchemy.sql import text

def seed_forms():
    form1 = Form(name="Application Form", link="https://example.com/apply", userId=1)
    form2 = Form(name="Feedback Form", link="https://example.com/feedback", userId=1)
    form3 = Form(name="Survey Form", link="https://example.com/survey", userId=2)
    form4 = Form(name="Registration Form", link="https://example.com/register", userId=3)
    
    db.session.add(form1)
    db.session.add(form2)
    db.session.add(form3)
    db.session.add(form4)
    db.session.commit()

def undo_forms():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.forms RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM forms"))
        
    db.session.commit()