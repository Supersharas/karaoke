
#from app.__init__ import db #, app
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

import os
#from sqlalchemy import Column, String, Integer, create_engine, JSON, LargeBinary
#'from flask_sqlalchemy import SQLAlchemy
import json
from datetime import datetime

from flask import current_app


def time_printer(tot_sec):
  hours = False
  if tot_sec:
    sec = tot_sec % 60
    minutes = (tot_sec - sec)/ 60
    strsec = str(sec)
    if len(strsec) == 1:
      strsec = '0' + strsec
    if minutes > 60:
      temp_min = minutes % 60
      hours = (minutes - temp_min)/ 60
      minutes = temp_min
    strmin = str(round(minutes))
    if len(strmin) == 1:
      strmin = '0' + strmin
    if hours:
      return str(round(hours)) + ':' + strmin + ':' + strsec
    else:
      return strmin + ':' + strsec
  else:
    return tot_sec


class Song(db.Model):
  __tablename__ = 'songs'
  id = db.Column(db.Integer, primary_key=True)
  title = db.Column(db.String())
  artist = db.Column(db.String())
  image = db.Column(db.String())
  date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
  audio = db.Column(db.String())
  #score = db.Column(db.Float)
  #finished = db.Column(db.Boolean, default=False) 
  #questions = db.Column(db.JSON)
  text = db.Column(db.String())
  conductor  = db.Column(db.String())
  #state = db.Column(db.Integer, default=0)
  #comments = db.relationship("Comment", backref=db.backref('state'))

  def insert(self):
    db.session.add(self)
    db.session.commit()
  
  def update(self):
    current_app.logger.info('updating')
    db.session.commit()

  def delete(self):
    db.session.delete(self)
    db.session.commit()

  def format(self):
    return {
      'id': self.id,
      'title': self.title,
      'artist': self.artist,
      'image': self.image,
      'date': str(self.date.date()),
      'audio': self.audio,
      'text': self.text,
      'conductor': self.conductor
    }

class Test(db.Model):
  __tablename__ = 'tests'
  id = db.Column(db.Integer, primary_key=True)
  title = db.Column(db.String())
  artist = db.Column(db.String())
  image = db.Column(db.String())
  date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
  audio = db.Column(db.String())
  text = db.Column(db.String())
  conductor  = db.Column(db.String())

  def insert(self):
    db.session.add(self)
    db.session.commit()
  
  def update(self):
    current_app.logger.info('updating')
    db.session.commit()

  def delete(self):
    db.session.delete(self)
    db.session.commit()

  def format(self):
    return {
      'id': self.id,
      'title': self.title,
      'artist': self.artist,
      'image': self.image,
      'date': str(self.date.date()),
      'audio': self.audio,
      'text': self.text,
      'conductor': self.conductor
    }

