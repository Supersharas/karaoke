from flask import Blueprint, render_template, url_for, jsonify, request, session, redirect

import json 

compositor = Blueprint('compositor', __name__,
		template_folder='templates',
		static_folder='static', static_url_path='/compositor')


#from app.compositor.recorder import create
from app.classes.tune import Tune

@compositor.route('/')
def home():
	return render_template('compositor.html')

@compositor.post('/create')
def new_song():
  content = json.loads(request.data)
  name = content.get('name', None)
  audio = content.get('audio', None)
  lyrics = content.get('lyrics', None)
  song = Tune(name, audio, lyrics)
  return song.__str__()