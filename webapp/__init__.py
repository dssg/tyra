from flask import Flask
from webapp.flask_util_js import FlaskUtilJs
from flask_sqlalchemy import SQLAlchemy
import flask_login
import json
from config import db_dict

app = Flask(__name__,instance_relative_config=True)
app.secret_key = "tyra american top models"
app.config['SQLALCHEMY_DATABASE_URI'] = db_dict['sfpd']['url']
app.config['SQLALCHEMY_BINDS'] = {
    'cmpd': db_dict['cmpd']['url'],
    'lapd': db_dict['lapd']['url']
}
db = SQLAlchemy(app)
fujs = FlaskUtilJs(app)
login_manager = flask_login.LoginManager()
login_manager.init_app(app)

with open('example_users.json') as h:
    users = json.load(h)

from webapp import controller, query
