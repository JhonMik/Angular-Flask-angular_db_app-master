import os
from functools import wraps
from flask import jsonify, Flask, request, url_for
from flask_restful import Resource, Api, reqparse
from flask_restful import fields, marshal_with, abort
from .models import User, Organization
from werkzeug import secure_filename, check_password_hash
import pandas as pd
import json
import time


from flask.views import MethodView
from flask import Blueprint, make_response, request, jsonify
from myapi.models import AdminUser


def current_milli_time(): return int(round(time.time() * 1000))


def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.environ['HTTP_AUTHORIZATION']
        if auth_header:
            auth_token = auth_header.split(" ")[1]
        else:
            auth_token = ''
        print('--------------------')
        print(request.headers)
        if auth_token:
            resp = AdminUser.decode_auth_token(auth_token)
            if not isinstance(resp, str):
                user = AdminUser.query.filter_by(id=resp).first()
                return f(*args, **kwargs)
            return abort(401)
        else:
            return abort(401)
    return decorated


class AdminManage(Resource):
    @requires_auth
    def post(self):
        try:
            data = json.loads(request.data.decode())
            if data and data['old'] and data['new']:
                if AdminUser.updatepassword(data['old'], data['new']):
                    return {
                        "res": 'ok',
                    }, 201
            return {"res": 'failed'}, 200
        except Exception as ex:
            print(ex)
            return {
                'res': 'failed',
            }, 200


class CSVImports(Resource):

    def getOrganization(self, orgstr):
        orgs = orgstr.split(';')
        res = []
        for orgEle in orgs:
            try:
                org = Organization.find_org_by_name(orgEle)
            except Exception as ex:
                Organization.add_new_organize(orgEle)
                org = Organization.find_org_by_name(orgEle)

            res.append(org.id)
        print(res)
        return res

    @requires_auth
    def post(self):
        try:
            print('--- post start-------')
            csvFile = request.files['file']
            filename = secure_filename(csvFile.filename)
            if not filename:
                return {
                    'res': 'failed',
                    'msg': 'CSV file isn\'t exsit'
                }, 200
            filename = str(current_milli_time()) + '.csv'

            from main import APP_ROOTPATH
            path = os.path.join(APP_ROOTPATH, 'temp')
            if not os.path.exists(path):
                os.makedirs(path)

            path = os.path.join(APP_ROOTPATH, 'temp', filename)
            csvFile.save(path)
            data = pd.read_csv(path)
            for row in range(0, len(data)):
                newPerson = {
                    'name': data['Person (ENG)'][row],
                    'branchOfGov': data['Branch of Government'][row],
                    'ministry': data['Ministry'][row],
                    'position': data['Position'][row],
                    'gender': data['Gender'][row],
                    'age': str(data['Age'][row]),
                    'ancestry': data['Ancestry'][row],
                    'ethnicity': data['Ethnicity'][row],
                    'organizations': self.getOrganization(data['Organization'][row]),
                }
                User.add_userdata_by_json(newPerson)

            os.remove(path)
            return {
                'res': 'ok'
            }, 200
        except Exception as ex:
            print(ex)
            return {
                'res': 'failed',
                'msg': 'CSV file isn\'t exsit'
            }, 200


class UserDetails(Resource):

    def get_user_by_id(self, user_id):
        users = User.query.filter_by(id=user_id).one()
        return jsonify(users.serialize)

    def get(self, user_id):
        return self.get_user_by_id(user_id)

    @requires_auth
    def post(self, user_id):
        data = json.loads(request.data.decode())
        if(data):
            User.update_userdata_by_json(user_id, data)
            return 'ok', 201
        return 'failed', 200

    # for image upload
    @requires_auth
    def put(self, user_id):
        print('--- put start-------')
        image = request.files['image']
        filename = secure_filename(image.filename)
        if not filename:
            return {
                'res': 'failed',
                'msg': 'Image file isn\'t exsit'
            }, 200

        from main import APP_ROOTPATH
        path = os.path.join(APP_ROOTPATH, 'static',
                            'photos',  filename)
        image.save(path)
        if User.update_image_by_id(user_id, filename):
            return {
                'res': 'ok'
            }, 200

        print('-----put end-----')

        return 'failed', 200

    @requires_auth
    def delete(self, user_id):
        if User.delete_by_id(user_id):
            return 'ok', 200
        else:
            return 'failed', 200


class UserLists(Resource):
    def get_users_serialize(self):
        users = User.query.all()
        return jsonify([b.serialize for b in users])

    def get(self):
        return self.get_users_serialize()

    @requires_auth
    def post(self):
        data = json.loads(request.data.decode())
        print(data)
        if data:
            user = User.add_userdata_by_json(data)
            if user:
                return {
                    "res": 'ok',
                    "userid": user.id
                }, 201
            else:
                return {
                    "res": 'failed',
                    "message": 'Entity already exists!'
                }, 201
        return {"res": 'failed'}, 200


class OrgDetails(Resource):

    def get_org_by_id(self, org_id):
        orgs = Organization.query.filter_by(id=org_id).one()
        return jsonify(orgs.serialize)

    def get(self, org_id):
        return self.get_org_by_id(org_id)

    @requires_auth
    def post(self, org_id):
        parser = reqparse.RequestParser()
        parser.add_argument('name')
        args = parser.parse_args()
        try:
            if args and args.name and Organization.update_by_id(org_id, args.name):
                return 'ok', 201
        except Exception as ex:
            print(ex)
        return 'fail', 201

    @requires_auth
    def delete(self, org_id):
        try:
            Organization.delete_by_id(org_id)
        except Exception as ex:
            print(ex)
        return 'ok', 200


class OrgLists(Resource):
    def get_orgs_serialize(self):
        orgs = Organization.query.all()
        return jsonify([b.serialize for b in orgs])

    def get(self):
        return self.get_orgs_serialize()

    @requires_auth
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name')
        args = parser.parse_args()
        try:
            if args and args.name and Organization.add_new_organize(args.name):
                return 'ok', 201
        except Exception as ex:
            print(ex)
        return 'fail', 201


class LoginView(MethodView):
    """This class-based view handles user login and access token generation."""

    def post(self):
        """Handle POST request for this view. Url ---> /auth/login"""
        try:
            # Get the user object using their email (unique to every user)

            data = json.loads(request.data.decode())
            user = AdminUser.query.filter_by(email=data['email']).first()

            # Try to authenticate the found user using their password
            if user and user.password_is_valid(data['password']):
                # Generate the access token. This will be used as the authorization header
                access_token = user.generate_token(user.id)
                if access_token:
                    response = {
                        'message': 'You logged in successfully.',
                        'token': access_token.decode()
                    }
                    return make_response(jsonify(response)), 200
            else:
                # User does not exist. Therefore, we return an error message
                response = {
                    'message': 'Invalid email or password, Please try again'
                }
                return make_response(jsonify(response)), 401

        except Exception as e:
            # Create a response containing an string error message
            response = {
                'message': str(e)
            }
            # Return a server error using the HTTP Error Code 500 (Internal Server Error)
            return make_response(jsonify(response)), 500


login_view = LoginView.as_view('login_view')
