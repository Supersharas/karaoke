
from flask import Flask

from app.land.land import land
from app.compositor.compositor import compositor


app = Flask(__name__)

app.register_blueprint(land, url_prefix='/')
app.register_blueprint(compositor, url_prefix='/compositor')


if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8080)


#from app import route