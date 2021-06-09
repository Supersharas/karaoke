import os

class Config(object):
  DEBUG = True
  SECRET_KEY = os.environ.get('SECRET_KEY') or b'_5#y2L"F4Q8z\n\xec]/'
  #SQLALCHEMY_DATABASE_URI = 'postgresql://postgres_user:9Krokodilai@localhost:5432/sing' #os.environ.get('DATABASE_URL')
  SQLALCHEMY_DATABASE_URI = 'postgresql://fwkpnotv:1wvhldt6f766_VfD2ighEipij_Q9xQJL@rogue.db.elephantsql.com/fwkpnotv' 
  
  #'postgres://yifsxpuo:Hrq7vJdvVUjHQrfN77OU9sPwS2petk0P@kandula.db.elephantsql.com:5432/yifsxpuo'
  
  #SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
  SQLALCHEMY_TRACK_MODIFICATIONS = False