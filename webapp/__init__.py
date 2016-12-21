from flask import Flask
from webapp.flask_util_js import FlaskUtilJs
from flask_sqlalchemy import SQLAlchemy
from config import dburl

app = Flask(__name__,instance_relative_config=True)
app.config['SQLALCHEMY_DATABASE_URI'] = dburl
db = SQLAlchemy(app)
fujs = FlaskUtilJs(app)

from webapp import controller, query
