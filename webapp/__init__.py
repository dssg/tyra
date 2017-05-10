from flask import Flask
from webapp.flask_util_js import FlaskUtilJs
from flask_sqlalchemy import SQLAlchemy
from config import dburl
import flask_login
import json

app = Flask(__name__,instance_relative_config=True)
app.secret_key = "tyra american top models"
app.config['SQLALCHEMY_DATABASE_URI'] = dburl
db = SQLAlchemy(app)
fujs = FlaskUtilJs(app)

login_manager = flask_login.LoginManager()
login_manager.init_app(app)

with open('users.json') as h:
    users = json.load(h)

from webapp import controller, query
