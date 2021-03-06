
import json
import traceback

class Tune_error(Exception):
	def nice_error(self):
		return json.dumps({'args':self.args, 'context': str(self.__context__), 'cause': str(self.__cause__),
			'traceback': str(traceback.format_tb(self.__traceback__)), 'str': self.__str__()})



class Silent_error(Tune_error):
	pass