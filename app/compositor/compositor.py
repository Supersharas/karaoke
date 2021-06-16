from flask import Blueprint, render_template, url_for, jsonify, request, session, redirect

from flask import current_app

import json 

compositor = Blueprint('compositor', __name__,
		template_folder='templates',
		static_folder='static', static_url_path='/compositor')

from app.classes.tune import Tune
from app.classes.tune_error import Tune_error

cache = False

def check_cache():
  if cache:
    return cache

def update_cache(tune):
  global cache
  current_app.logger.info('cache updated {}'.format(cache))
  cache = tune

@compositor.route('/')
def home():
  if cache:
    return render_template('compositor.html', tune=check_cache())
  else:
    return render_template('compositor.html', tune='cache is empty')

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
  update_cache(song)
  return song.__str__()

@compositor.post('/get')
def get_song():
  content = json.loads(request.data)
  song_id = content.get('id', None)
  conductor = content.get('conductor', None)
  if conductor:
    try:
      song = Tune(song_id)
      song.conduct(conductor)
    except Tune_error as e:
      return e.nice_error()
  else:
    try:
      song = Tune(song_id)
    except Tune_error as e:
      return e.nice_error()
  update_cache(song)
  return song.__str__()