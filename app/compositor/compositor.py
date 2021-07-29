from flask import Blueprint, render_template, url_for, jsonify, request, session, redirect

from flask import current_app
from app.models import db

import json
import platform

print(platform.platform())

compositor = Blueprint('compositor', __name__,
		template_folder='templates',
		static_folder='static', static_url_path='/compositor')

from app.classes.tune import Tune
from app.classes.tune_error import Tune_error, Silent_error
from app.classes.cache import Cache
from app.classes.loger import Tune_log

tune_log = Tune_log('compositor')
cache = Cache()
tune_log.log('here we go' + platform.platform())

@compositor.route('/')
def home():
  song = cache.get_compositor()
  tune_log.log('opening compositor')
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
    cache.update_compositor(song.song)
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
  try:
    song = Tune(song_id)
    current_app.logger.info(song.song)
    cache.update_compositor(song)
  except Silent_error as e:
    current_app.logger.info(e.nice_error)
    db.session.close()
    return song.__str__()
  except Tune_error as e:
    db.session.close()
    return e.nice_error()
  db.session.close()
  return song.__str__()

@compositor.post('/conduct')
def conduct():
  content = json.loads(request.data)
  song_id = content.get('id', None)
  update = content.get('update', None)
  tune_log.log('conducting {} {}'.format(song_id, update) )
  # if update:
  #   try:
  #     song = Tune(song_id)
  #     song.conduct(update)
  #     cache.update_compositor(song)
  #     db.session.close()
  #   except Tune_error as e:
  #     db.session.close()
  #     return e.nice_error()
  # return json.dumps({'update': update})
  return json.dumps({'success': True, 'song_id': song_id})

@compositor.get('/rehersal/<int:song_id>')
def rehersal(song_id):
  return render_template('rehersal.html', song_id=song_id)