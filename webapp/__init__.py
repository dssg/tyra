from flask import Flask
from webapp.flask_util_js import FlaskUtilJs
from flask_sqlalchemy import SQLAlchemy
from config import dburl, SQLALCHEMY_BINDS

app = Flask(__name__,instance_relative_config=True)
app.config['SQLALCHEMY_DATABASE_URI'] = dburl
app.config['SQLALCHEMY_BINDS'] = SQLALCHEMY_BINDS
db = SQLAlchemy(app)
#db.create_all(bind='users')
fujs = FlaskUtilJs(app)

from webapp import controller, query
