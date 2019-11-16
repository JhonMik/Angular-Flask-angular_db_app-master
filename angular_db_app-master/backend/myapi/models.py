import os
from flask import Blueprint, render_template, redirect, url_for, request, flash
from werkzeug import secure_filename
import uuid
from main import db
import json
from flask_login import UserMixin
from datetime import datetime, timedelta
import jwt
from werkzeug.security import generate_password_hash, check_password_hash


organizations = db.Table('organizations',
                         db.Column('organization_id', db.Integer, db.ForeignKey(
                             'organization.id'), primary_key=True),
                         db.Column('user_id', db.Integer, db.ForeignKey(
                             'user.id'), primary_key=True),
                         )


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255),  nullable=False)
    branchOfGov = db.Column(db.String(255))
    organizations = db.relationship(
        'Organization', secondary=organizations, lazy='subquery', backref=db.backref('users', lazy=True))
    ministry = db.Column(db.String(255))
    position = db.Column(db.String(255))
    gender = db.Column(db.String(255))
    age = db.Column(db.String(255))
    ancestry = db.Column(db.String(255))
    ethnicity = db.Column(db.String(255))
    imageurl = db.Column(db.String(255))

    def __init__(self, name, branchOfGov, ministry, position, gender, age, ancestry, ethnicity, imageurl):
        self.name = name
        self.branchOfGov = branchOfGov
        self.ministry = ministry
        self.position = position
        self.gender = gender
        self.age = age
        self.ancestry = ancestry
        self.ethnicity = ethnicity
        self.imageurl = imageurl

    def __repr__(self):
        return '<User %r>' % (self.name)

    @property
    def serialize(self):
        print(self.organizations)
        return {
            'userid': self.id,
            'name': self.name,
            'branchOfGov': self.branchOfGov,
            'organizations': [org.json()['name'] for org in self.organizations],
            'ministry': self.ministry,
            'position': self.position,
            'gender': self.gender,
            'age': self.age,
            'ancestry': self.ancestry,
            'ethnicity': self.ethnicity,
            'imageurl': self.imageurl,
        }

    def json(self):
        print(self.organizations)
        return {
            'userid': self.id,
            'name': self.name,
            'branchOfGov': self.branchOfGov,
            'orgslist': [org.json() for org in self.organizations],
            'ministry': self.ministry,
            'position': self.position,
            'gender': self.gender,
            'age': self.age,
            'ancestry': self.ancestry,
            'ethnicity': self.ethnicity,
            'imageurl': self.imageurl,
        }

    def updateOrgList(self, upOrgIds):

        oldOrgIds = [str(org.id) for org in self.organizations]
        orgIds = [str(upOrg) for upOrg in upOrgIds]
        removeItems = list(set(oldOrgIds) - set(orgIds))
        print('------remove----------')
        print(removeItems)
        print('------insert----------')
        insertItems = list(set(orgIds) - set(oldOrgIds))
        print(insertItems)
        print('---- old list -----')
        print(oldOrgIds)
        for reItem in removeItems:
            selectedorg = Organization.find_org_by_id(int(reItem))
            self.organizations.remove(selectedorg)
        db.session.commit()

        for inItem in insertItems:
            selectedorg = Organization.find_org_by_id(int(inItem))
            self.organizations.append(selectedorg)

        db.session.commit()

    @classmethod
    def find_user_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    @classmethod
    def find_user_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()

    @classmethod
    def update_image_by_id(cls, user_id, filename):
        try:
            user = User.find_user_by_id(user_id)
            user.imageurl = url_for('static', filename="photos/" + filename)
            db.session.commit()
            return True
        except Exception as ex:
            return False

    @classmethod
    def delete_by_id(cls, _id):
        try:
            row = cls.query.filter_by(id=_id).first()
            print(row)
            db.session.delete(row)
            db.session.commit()
            return True
        except Exception as ex:
            return False

    @classmethod
    def find_all_users(cls):
        return cls.query.all()

    @classmethod
    def update_userdata(cls, _id, form):
        user = cls.query.filter_by(id=_id).first()
        try:
            f = form.file.data
            filename = uid.uuid4().hex + f.filename.split('.')[-1]
            print(filename)
            if filename:
                f.save(os.path.join('/static',
                                    'photos',  filename))
                user.imageurl = url_for(
                    'static', filename="photos/" + filename)
        except Exception as ex:
            print('not upload file')
            pass

        print(form.data)
        user.name = form.data.get('name')
        user.gender = form.data.get('gender')
        user.branchOfGov = form.data.get('branchOfGov')
        user.ministry = form.data.get('ministry')
        user.position = form.data.get('position')
        user.age = form.data.get('age')
        user.ancestry = form.data.get('ancestry')
        user.ethnicity = form.data.get('ethnicity')
        db.session.commit()

        orgIDs = form.data.get('orgslist'),
        user.updateOrgList(orgIDs[0].split(','))

    @classmethod
    def update_userdata_by_json(cls, _id, data):
        user = cls.query.filter_by(id=_id).first()

        user.name = data['name']
        user.gender = data['gender']
        user.branchOfGov = data['branchOfGov']
        user.ministry = data['ministry']
        user.position = data['position']
        user.age = data['age']
        user.ancestry = data['ancestry']
        user.ethnicity = data['ethnicity']
        db.session.commit()

        orgIDs = data['organizations']
        user.updateOrgList(orgIDs)

    @classmethod
    def add_userdata_by_json(cls, data):
        user = User(
            imageurl=url_for('static', filename="photos/default_avatar.png"),
            name=data['name'],
            gender=data['gender'],
            branchOfGov=data['branchOfGov'],
            ministry=data['ministry'],
            position=data['position'],
            age=data['age'],
            ancestry=data['ancestry'],
            ethnicity=data['ethnicity']
        )
        db.session.add(user)
        db.session.commit()
        orgIDs = data['organizations']
        user.updateOrgList(orgIDs)
        return user

    @classmethod
    def addNewUser(cls, form):
        f = form.file.data
        filename = secure_filename(f.filename)
        if not filename:
            flash('Error: Image file isn\'t exist')
            return

        from main import APP_ROOTPATH
        path = os.path.join(APP_ROOTPATH, 'static',
                            'photos',  filename)
        f.save(path)
        user = User(
            imageurl=url_for('static', filename="photos/" + filename),
            name=form.data.get('name'),
            gender=form.data.get('gender'),
            branchOfGov=form.data.get('branchOfGov'),
            ministry=form.data.get('ministry'),
            position=form.data.get('position'),
            age=form.data.get('age'),
            ancestry=form.data.get('ancestry'),
            ethnicity=form.data.get('ethnicity')
        )
        db.session.add(user)
        db.session.commit()
        orgIDs = form.data.get('orgslist'),
        user.updateOrgList(orgIDs[0].split(','))


class Organization(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255),  nullable=False, unique=True)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name
        }

    def json(self):
        return {
            'id': self.id,
            'name': self.name
        }

    @classmethod
    def find_org_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()

    @classmethod
    def find_org_by_name(cls, _name):
        return cls.query.filter_by(name=_name).first()

    @classmethod
    def find_all_organizes(cls):
        return cls.query.all()

    @classmethod
    def add_new_organize(cls, value):
        try:
            org = Organization.find_org_by_name(value)
            print(org)
            if org.name:
                return False
        except Exception as ex:
            pass
        org = Organization()
        org.name = value
        db.session.add(org)
        db.session.commit()
        return True

    @classmethod
    def update_by_id(cls, org_id, value):
        org = Organization.find_org_by_id(org_id)
        org.name = value
        db.session.commit()
        return True

    @classmethod
    def delete_by_id(cls, org_id):
        org = Organization.find_org_by_id(org_id)
        db.session.delete(org)
        db.session.commit()
        return True


class AdminUser(UserMixin, db.Model):
    # primary keys are required by SQLAlchemy
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(1000))

    def generate_token(self, user_id):
        """ Generates the access token"""

        try:
            # set up a payload with an expiration time
            payload = {
                'exp': datetime.utcnow() + timedelta(minutes=300),
                'iat': datetime.utcnow(),
                'sub': user_id
            }
            # create the byte string token using the payload and the SECRET key
            from main import current_app
            jwt_string = jwt.encode(
                payload,
                current_app.config.get('SECRET_KEY'),
                algorithm='HS256'
            )
            return jwt_string

        except Exception as e:
            # return an error in string format if an exception occurs
            return str(e)

    @classmethod
    def updatepassword(cls, oldpwd, newpwd):
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
                if user.password_is_valid(oldpwd):
                    user.password = generate_password_hash(
                        newpwd, method='sha256')
                    db.session.commit()
                    return True

        return False

    @staticmethod
    def decode_auth_token(token):
        """Decodes the access token from the Authorization header."""
        try:
            from main import current_app
            # try to decode the token using our SECRET variable
            payload = jwt.decode(token, current_app.config.get('SECRET_KEY'))
            return payload['sub']
        except jwt.ExpiredSignatureError:
            # the token is expired, return an error string
            return "Expired token. Please login to get a new token"
        except jwt.InvalidTokenError:
            # the token is invalid, return an error string
            return "Invalid token. Please register or login"

    def password_is_valid(self, password):
        """
        Checks the password against it's hash to validates the user's password
        """
        return check_password_hash(self.password, password)
