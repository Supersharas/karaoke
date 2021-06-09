from flask import Blueprint, render_template, url_for, jsonify, request, session, redirect

import json 

compositor = Blueprint('compositor', __name__,
		template_folder='templates',
		static_folder='static', static_url_path='/compositor')


#from app.compositor.recorder import create
from app.classes.tune import Tune
from app.classes.tune_error import Tune_error

@compositor.route('/')
def home():
	return render_template('compositor.html')

@compositor.post('/create')
def new_song():
  content = json.loads(request.data)
  name = content.get('name', None)
  audio = content.get('audio', None)
  lyrics = content.get('lyrics', None)
  try:
    song = Tune(name, audio, lyrics)
  except Tune_error as e:
    return e.nice_error()
  return song.__str__()