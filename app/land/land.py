
from flask import Blueprint, render_template

land = Blueprint('land', __name__,
    template_folder='templates')

@land.route('/')
def home():
  return render_template('sing.html')
