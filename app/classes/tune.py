
import json

from app.models import db, Song
from app.classes.tune_error import Tune_error
from app.classes.loger import Tune_log

tune_log = Tune_log('Tune')

class Tune:

  error = False

  def __init__(self, *args):
    helper = 'unknown error with arguments: ' + str(args)
    if len(args) > 1:
      [name, audio, lyrics] = args
      try:
        song = Song(name=name, audio=audio, text=lyrics)
        song.insert()
      except Exception as e:
        raise Tune_error(' Initializing Object') from e       
    else:
      try: 
        song = Song.query.filter_by(id=args[0]).first()
        helper = 'no such song were found on our database '
      except Exception as e:
        raise Tune_error('Database error while looking for song.') from e
    try:
      self.song = song
      # db.session.close()
    except Exception as e:
      raise Tune_error(helper) from e 
      

  def __str__(self):
    if self.error:
      return json.dumps({'error': self.error})
    else:
      return json.dumps({'id': self.song.id, 'name': self.song.name, 'audio': self.song.audio, 'lyrics': self.song.text, 'conductor': self.song.conductor})

  def conduct(self, notes):
    try:
      self.song.conductor = notes['conductor']
      self.song.name = notes['name']
      self.song.audio = notes['audio']
      self.song.lyrics = notes['lyrics'] 
      self.song.update()
    except Exception as e:
      raise Tune_error('Database error while conducting.') from e
    tune_log.log('conducted {}'.format(notes['conductor']))
    return json.dumps({'success': self.__str__()})