from flask import Blueprint, render_template, url_for, jsonify, request, session, redirect

from flask import current_app

import json 

compositor = Blueprint('compositor', __name__,
		template_folder='templates',
		static_folder='static', static_url_path='/compositor')

from app.classes.tune import Tune
from app.classes.tune_error import Tune_error, Silent_error
from app.classes.cache import Cache

cache = Cache()

@compositor.route('/')
def home():
  song = cache.get_compositor()
  if song:
    return render_template('compositor.html', tune=song)
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
    cache.update_compositor(song)
  except Silent_error as e:
    current_app.logger.info(e.nice_error)
    return song.__str__()
  except Tune_error as e:
    return e.nice_error()
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
      cache.update_compositor(song)
    except Silent_error as e:
      current_app.logger.info(e.nice_error)
      return song.__str__()
    except Tune_error as e:
      return e.nice_error()
  else:
    try:
      song = Tune(song_id)
      cache.update_compositor(song)
    except Silent_error as e:
      current_app.logger.info(e.nice_error)
      return song.__str__()
    except Tune_error as e:
      return e.nice_error()
  return song.__str__()