
from flask import current_app

import datetime
import random
import sys
import json

from app.models import db, Song

def create(name, audio, lyrics):
	error = False
	try:
		song = Song(name=name, audio=audio, text=lyrics)
		Song.insert(song)
	except:
		error = True
		current_app.logger.info(sys.exc_info())
	finally:
		db.session.close()
	if error:
		return {'success': False, 'error': sys.exc_info()}
	else:
		current_app.logger.info('no error here')
		return {'success': True}