from jinja2 import TemplateNotFound
from flask import Blueprint, render_template, abort
from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS
# from flask_dotenv import DotEnv
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    global APP_ROOTPATH
    APP_ROOTPATH = app.root_path
    app.config['SECRET_KEY'] = '9OLWxND4o83j4K4iuopO'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # env = DotEnv(app)
    # print(env)
    #
    # db
    db.init_app(app)

    # api router module add
    from myapi import api_resource
    app.register_blueprint(api_resource)

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    from myapi.models import AdminUser
    from myapi.models import User

    @app.route('/')
    def homepage():
        return 'This is backend Code'

    global current_app
    current_app = app
    return app
