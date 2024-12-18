from app.models import db, Contact, environment, SCHEMA
from sqlalchemy.sql import text



def seed_contacts():
    contact1 = Contact(name="Demo", phone="349-905-214", email="poptart@gmail.com", company="Poptart", userId=1)
    contact2 = Contact(name="Tina", phone="749-569-213", email="tinaCompany@gmail.com", company="TinaOps", userId=2)
    contact3 = Contact(name="Donald", phone="521-675-315", email="donaldGaming@gmail.com", company="DonaldGaming", userId=4)
    db.session.add(contact1)
    db.session.add(contact2)
    db.session.add(contact3)
    db.session.commit()



def undo_contacts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.contacts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM contacts"))
        
    db.session.commit()