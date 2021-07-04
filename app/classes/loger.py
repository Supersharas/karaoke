
from datetime import datetime

import logging
logging.basicConfig(format='%(asctime)s %(message)s', filename='jurnal.log', level=logging.WARNING)
logging.debug('This message should go to the log file')

class Tune_log:

  def __init__(self, facility):
    self.facility = facility

  def log(self, text):
    logging.warning('===================> {} =>> {} '.format(self.facility, text))