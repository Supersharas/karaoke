
import json

from app.models import db, Song
from app.classes.tune_error import Tune_error

def get_all_songs():
  tunes = []
  try:
    songs = Song.query.all()
    for song in songs:
      tunes.append(song.format())
    db.session.close()
  except Exception as e:
    db.session.close()
    raise Tune_error('Error in retrieving all songs') from e

  return tunes
    