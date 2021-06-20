
from app.classes.tune_error import Tune_error, Silent_error

from flask import current_app

import sys


class Cache:
  
  compositor = {}
  compositor_id = False
  popular = []

  def get_compositor(self):
    return self.compositor

  def update_compositor(self, tune):
    current_app.logger.info(tune)
    try:
      self.compositor = tune
    except Exception as e:
      current_app.logger.info(sys.exc_info())
      raise Silent_error('Error updating compositor_cache') from e
  
  def set_popular(self, pop):
    self.popular = pop

  def get_popular(self):
    return self.popular
