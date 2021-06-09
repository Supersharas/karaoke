
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
    name, audio, lyrics = False, False, False
    if len(args) > 1:
      [name, audio, lyrics] = args
      try:
        song = Song(name=name, audio=audio, text=lyrics)
        Song.insert(song)
      except Exception as e:
        raise Tune_error(' Initializing Object') from e       
    else:
      try:
        song = db.query.filter_by(id=args[0]).first() 
      except:
        self.error = sys.exc_info()
    self.id = song.id
    self.name = song.name
    self.audio = song.audio
    self.lyrics = song.text
    self.conductor = song.conductor
    db.session.close()

  def __str__(self):
    if self.error:
      return json.dumps({'error': self.error})
    else:
      return json.dumps({'name': self.name, 'audio': self.audio, 'lyrics': self.lyrics})

  def conduct(self, notes):
    try:
      song = db.query.filter_by(id=self.id).first()
      song.conductor = notes
    except:
      self.error = current_app.logger.info(sys.exc_info())
    finally:
      self.conductor = notes
      db.session.close()
    if self.error:
      return json.dumps({'error': self.error})
    else:
      return json.dumps({'success': True})