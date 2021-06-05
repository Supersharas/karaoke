from flask import Blueprint, render_template


compositor = Blueprint('compositor', __name__,
		template_folder='templates',
		static_folder='static', static_url_path='/compositor')


from app.compositor.recorder import create

@compositor.route('/')
def home():
	if create():
		return render_template('compositor.html')
	else:
		return 'bad bad bad'
