"""create job_users_table

Revision ID: 4c25eb88ca5e
Revises: dd9d0e626096
Create Date: 2024-12-16 19:45:03.574513

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# revision identifiers, used by Alembic.
revision = '4c25eb88ca5e'
down_revision = 'dd9d0e626096'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    # op.create_table('job_users',
    # sa.Column('user_id', sa.Integer(), nullable=False),
    # sa.Column('job_id', sa.Integer(), nullable=False),
    # sa.ForeignKeyConstraint(['job_id'], ['jobs.id'], ),
    # sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    # sa.PrimaryKeyConstraint('user_id', 'job_id')
    # )
    
    if environment == "production":
        op.execute(f"ALTER TABLE users SET SCHEMA {SCHEMA};")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    # op.drop_table('job_users')
    pass
    # ### end Alembic commands ###
