"""empty message

Revision ID: 0d70b8169971
Revises: 302905e07b40
Create Date: 2021-07-31 09:41:39.070518

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0d70b8169971'
down_revision = '302905e07b40'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('tests',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(), nullable=True),
    sa.Column('artist', sa.String(), nullable=True),
    sa.Column('image', sa.String(), nullable=True),
    sa.Column('date', sa.DateTime(), nullable=False),
    sa.Column('audio', sa.String(), nullable=True),
    sa.Column('text', sa.String(), nullable=True),
    sa.Column('conductor', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column('songs', sa.Column('title', sa.String(), nullable=True))
    op.add_column('songs', sa.Column('artist', sa.String(), nullable=True))
    op.add_column('songs', sa.Column('image', sa.String(), nullable=True))
    op.drop_column('songs', 'name')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('songs', sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_column('songs', 'image')
    op.drop_column('songs', 'artist')
    op.drop_column('songs', 'title')
    op.drop_table('tests')
    # ### end Alembic commands ###
