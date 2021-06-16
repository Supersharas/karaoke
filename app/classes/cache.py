
from app.classes.tune_error import Tune_error, Silent_error


class Cache:
	
	compositor = {}
	compositor_id = False

	def get_compositor(self):
		return self.compositor

	def update_compositor(self, tune):
		try:
			if tune.id != self.compositor_id:
				self.compositor = tune
				self.compositor_id = tune.id
		except Exception as e:
			raise Silent_error('Error updating compositor_cache') from e
