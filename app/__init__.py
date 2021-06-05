
from flask import Flask
from config import Config
#from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from app.models import db

from app.land.land import land
from app.compositor.compositor import compositor


app = Flask(__name__)


app.config.from_object(Config)
app.debug = True
#db = SQLAlchemy(app)
db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(land, url_prefix='/')
app.register_blueprint(compositor, url_prefix='/compositor')


if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8080)


#from app import route