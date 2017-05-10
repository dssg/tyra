from flask import Flask
from webapp.flask_util_js import FlaskUtilJs
from flask_sqlalchemy import SQLAlchemy
from config import dburl
import flask_login

app = Flask(__name__,instance_relative_config=True)
app.secret_key = "tyra american top models"
app.config['SQLALCHEMY_DATABASE_URI'] = dburl
db = SQLAlchemy(app)
fujs = FlaskUtilJs(app)

login_manager = flask_login.LoginManager()
login_manager.init_app(app)

users = {'power6188@gmail.com': {'pw': 'power6188'}}

from webapp import controller, query
