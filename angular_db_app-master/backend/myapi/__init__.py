from jinja2 import TemplateNotFound
from flask import Blueprint, render_template, abort, jsonify
from flask import Flask, request, make_response
from flask_restful import Resource, Api
from myapi.models import AdminUser
import jwt
import datetime
from myapi.resources import UserDetails, UserLists, OrgDetails, OrgLists, CSVImports, login_view, AdminManage


def create_api():
    api = Api(api_resource)
    api.add_resource(UserDetails, '/users/<string:user_id>')
    api.add_resource(UserLists, '/users/')
    api.add_resource(OrgDetails, '/orgs/<string:org_id>')
    api.add_resource(OrgLists, '/orgs/')
    api.add_resource(CSVImports, '/csv/')
    api.add_resource(AdminManage, '/admin/')
    api_resource.add_url_rule(
        '/auth/login/',
        view_func=login_view,
        methods=['POST']
    )


api_resource = Blueprint('api', __name__, url_prefix='/api')
create_api()
