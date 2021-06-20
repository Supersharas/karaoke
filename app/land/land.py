
from flask import Blueprint, render_template, request
from flask import current_app


import datetime
import sys
import json

from app.models import db
from app.utilities import get_all_songs
from app.classes.cache import Cache
from app.classes.tune import Tune
from app.classes.tune_error import Tune_error, Silent_error

cache = Cache()

land = Blueprint('land', __name__,
    template_folder='templates')

@land.route('/')
def home():
  cached = False
  start_time = datetime.datetime.now()
  cached_tunes = cache.get_popular()
  if not cached_tunes:
    songs = get_all_songs()
    cache.set_popular(songs)
  else:
    songs = cached_tunes
    cached = True
  size = sys.getsizeof(songs)
  end_time = datetime.datetime.now()
  diff = end_time - start_time
  execution_time = diff.total_seconds() * 1000
  return render_template('sing.html', popular=songs, ex_time=execution_time, cached=cached, size=size)

@land.post('/get_song')
def get_song():
  content = json.loads(request.data)
  song_id = content.get('id', None)
  try:
    song = Tune(song_id)
  except Silent_error as e:
    current_app.logger.info(e.nice_error)
    db.session.close()
    return song.__str__()
  except Tune_error as e:
    db.session.close()
    return e.nice_error()
  db.session.close()
  return song.__str__()