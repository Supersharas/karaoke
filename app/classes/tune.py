
from flask import current_app

import datetime
import random
import sys
import json

from app.models import db, Song
from app.classes.tune_error import Tune_error


class Tune:

  error = False

  def __init__(self, *args):
    helper = 'unknown error with arguments: ' + str(args)
    if len(args) > 1:
      [name, audio, lyrics] = args
      try:
        song = Song(name=name, audio=audio, text=lyrics)
        Song.insert(song)
      except Exception as e:
        db.session.close()
        raise Tune_error(' Initializing Object') from e       
    else:
      try: 
        song = Song.query.filter_by(id=args[0]).first()
        helper = 'no such song were found on our database '
      except Exception as e:
        db.session.close()
        raise Tune_error('Database error while looking for song.') from e
    try:
      self.id = song.id
      self.name = song.name
      self.audio = song.audio
      self.lyrics = song.text
      self.conductor = song.conductor
      db.session.close()
    except Exception as e:
      raise Tune_error(helper) from e 
      

  def __str__(self):
    if self.error:
      return json.dumps({'error': self.error})
    else:
      return json.dumps({'id': self.id, 'name': self.name, 'audio': self.audio, 'lyrics': self.lyrics})

  def conduct(self, notes):
    try:
      song = db.query.filter_by(id=self.id).first()
      song.conductor = notes
    except Exception as e:
      db.session.close()
      raise Tune_error('Database error while conducting.') from e
    finally:
      self.conductor = notes
      db.session.close()
      return json.dumps({'success': True})