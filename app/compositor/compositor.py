from flask import Blueprint, render_template

compositor = Blueprint('compositor', __name__,
    template_folder='templates',
    static_folder='static', static_url_path='/compositor')

@compositor.route('/')
def home():
  return render_template('compositor.html')
