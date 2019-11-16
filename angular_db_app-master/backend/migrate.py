from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import db, create_app
from myapi.models import User, Organization, AdminUser
# Connect to Database and create database session
from werkzeug.security import generate_password_hash, check_password_hash
import random


def getPersonData():
    return [{
        "userid": 591,
        "name": "Genevieve Watts",
        "branchOfGov": "Executive",
        "ministry": "test1",
        "position": "Prime Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country1",
        "ethnicity": "Asian",
        "imageurl": "/static/photos/pic1.jpeg"
    },
        {
        "userid": 476,
        "name": "Ian Stevens",
        "branchOfGov": "Executive",
        "ministry": "Foreign Affairs",
        "position": "Minister",
        "gender": "Female",
        "age": "12",
        "ancestry": "country2",
        "ethnicity": "Asian",
        "imageurl": "/static/photos/pic2.jpeg"
    },
        {
        "userid": 133,
        "name": "Frederick Floyd",
        "branchOfGov": "Executive",
        "ministry": "Defense",
        "position": "Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country3",
        "ethnicity": "Asian",
        "imageurl": "/static/photos/pic3.jpeg"
    },
        {
        "userid": 456,
        "name": "Lizzie Hopkins",
        "branchOfGov": "Executive",
        "ministry": "Interior",
        "position": "Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country4",
        "ethnicity": "Asian",
        "imageurl": "/static/photos/pic4.jpeg"
    },
        {
        "userid": 524,
        "name": "Lewis Schneider",
        "branchOfGov": "Executive",
        "ministry": "Finanace",
        "position": "Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country5",
        "ethnicity": "African American",
        "imageurl": "/static/photos/pic5.jpeg"
    },
        {
        "userid": 777,
        "name": "Emma Elliott",
        "branchOfGov": "Executive",
        "ministry": "Industry and Trade",
        "position": "Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country6",
        "ethnicity": "Asian",
        "imageurl": "/static/photos/pic6.jpeg"
    },
        {
        "userid": 117,
        "name": "Jose Lewis",
        "branchOfGov": "Executive",
        "ministry": "Agriculture",
        "position": "Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country7",
        "ethnicity": "Asian",
        "imageurl": "/static/photos/pic7.jpeg"
    },
        {
        "userid": 88,
        "name": "Alice Curtis",
        "branchOfGov": "Executive",
        "ministry": "Religious Affairs",
        "position": "Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country8",
        "ethnicity": "Asian",
        "imageurl": "/static/photos/pic8.jpeg"
    },
        {
        "userid": 60,
        "name": "Danny Padilla",
        "branchOfGov": "Executive",
        "ministry": "Cabinet Affairs",
        "position": "Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country9",
        "ethnicity": "Asian",
        "imageurl": "/static/photos/pic9.jpeg"
    },
        {
        "userid": 317,
        "name": "Ophelia Sandoval",
        "branchOfGov": "Executive",
        "ministry": "Energy and Mining",
        "position": "Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country10",
        "ethnicity": "Caucasian",
        "imageurl": "/static/photos/pic10.jpeg"
    },
        {
        "userid": 243,
        "name": "Eliza Greer",
        "branchOfGov": "Executive",
        "ministry": "test1",
        "position": "Prime Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country1",
        "ethnicity": "Asian",
        "imageurl": "/static/photos/pic1.jpeg"
    },
        {
        "userid": 595,
        "name": "James McCoy",
        "branchOfGov": "Executive",
        "ministry": "Foreign Affairs",
        "position": "Minister",
        "gender": "Female",
        "age": "12",
        "ancestry": "country2",
        "ethnicity": "Asian",
        "imageurl": "/static/photos/pic2.jpeg"
    },
        {
        "userid": 895,
        "name": "Herman Wilkins",
        "branchOfGov": "Executive",
        "ministry": "Defense",
        "position": "Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country3",
        "ethnicity": "Asian",
        "imageurl": "/static/photos/pic3.jpeg"
    },
        {
        "userid": 906,
        "name": "Ray Riley",
        "branchOfGov": "Executive",
        "ministry": "Interior",
        "position": "Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country4",
        "ethnicity": "Asian",
        "imageurl": "/static/photos/pic4.jpeg"
    },
        {
        "userid": 100,
        "name": "Mabel Howell",
        "branchOfGov": "Executive",
        "ministry": "Finanace",
        "position": "Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country5",
        "ethnicity": "African American",
        "imageurl": "/static/photos/pic5.jpeg"
    },
        {
        "userid": 44,
        "name": "Belle Norman",
        "branchOfGov": "Executive",
        "ministry": "Industry and Trade",
        "position": "Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country6",
        "ethnicity": "Asian",
        "imageurl": "/static/photos/pic6.jpeg"
    },
        {
        "userid": 737,
        "name": "Joel Graves",
        "branchOfGov": "Executive",
        "ministry": "Agriculture",
        "position": "Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country7",
        "ethnicity": "Asian",
        "imageurl": "/static/photos/pic7.jpeg"
    },
        {
        "userid": 346,
        "name": "Gerald Tate",
        "branchOfGov": "Executive",
        "ministry": "Religious Affairs",
        "position": "Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country8",
        "ethnicity": "Asian",
        "imageurl": "/static/photos/pic8.jpeg"
    },
        {
        "userid": 105,
        "name": "Roy Phillips",
        "branchOfGov": "Executive",
        "ministry": "Cabinet Affairs",
        "position": "Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country9",
        "ethnicity": "Asian",
        "imageurl": "/static/photos/pic9.jpeg"
    },
        {
        "userid": 906,
        "name": "Alma Hawkins",
        "branchOfGov": "Executive",
        "ministry": "Energy and Mining",
        "position": "Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country10",
        "ethnicity": "Caucasian",
        "imageurl": "/static/photos/pic10.jpeg"
    },
        {
        "userid": 933,
        "name": "Mayme Green",
        "branchOfGov": "Executive",
        "ministry": "test1",
        "position": "Prime Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country1",
        "ethnicity": "Asian",
        "imageurl": "/static/photos/pic1.jpeg"
    },
        {
        "userid": 211,
        "name": "Jim Fitzgerald",
        "branchOfGov": "Executive",
        "ministry": "Foreign Affairs",
        "position": "Minister",
        "gender": "Female",
        "age": "12",
        "ancestry": "country2",
        "ethnicity": "Asian",
        "imageurl": "/static/photos/pic2.jpeg"
    },
        {
        "userid": 386,
        "name": "Dennis Carlson",
        "branchOfGov": "Executive",
        "ministry": "Defense",
        "position": "Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country3",
        "ethnicity": "Asian",
        "imageurl": "/static/photos/pic3.jpeg"
    },
        {
        "userid": 559,
        "name": "Bertha Boone",
        "branchOfGov": "Executive",
        "ministry": "Interior",
        "position": "Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country4",
        "ethnicity": "Asian",
        "imageurl": "/static/photos/pic4.jpeg"
    },
        {
        "userid": 920,
        "name": "Lily Hayes",
        "branchOfGov": "Executive",
        "ministry": "Finanace",
        "position": "Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country5",
        "ethnicity": "African American",
        "imageurl": "/static/photos/pic5.jpeg"
    },
        {
        "userid": 114,
        "name": "Minerva Vargas",
        "branchOfGov": "Executive",
        "ministry": "Industry and Trade",
        "position": "Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country6",
        "ethnicity": "Asian",
        "imageurl": "/static/photos/pic6.jpeg"
    },
        {
        "userid": 163,
        "name": "William Roberts",
        "branchOfGov": "Executive",
        "ministry": "Agriculture",
        "position": "Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country7",
        "ethnicity": "Asian",
        "imageurl": "/static/photos/pic7.jpeg"
    },
        {
        "userid": 951,
        "name": "Herbert Castro",
        "branchOfGov": "Executive",
        "ministry": "Religious Affairs",
        "position": "Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country8",
        "ethnicity": "Asian",
        "imageurl": "/static/photos/pic8.jpeg"
    },
        {
        "userid": 639,
        "name": "Joshua Nunez",
        "branchOfGov": "Executive",
        "ministry": "Cabinet Affairs",
        "position": "Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country9",
        "ethnicity": "Asian",
        "imageurl": "/static/photos/pic9.jpeg"
    },
        {
        "userid": 195,
        "name": "Alan Warren",
        "branchOfGov": "Executive",
        "ministry": "Energy and Mining",
        "position": "Minister",
        "gender": "Male",
        "age": "12",
        "ancestry": "country10",
        "ethnicity": "Caucasian",
        "imageurl": "/static/photos/pic10.jpeg"
    }]


def add_data():

    with app.app_context():

        admin = AdminUser(email="admin@hotmail.com", name="admin",
                          password=generate_password_hash("password", method='sha256'))
        db.session.add(admin)
        db.session.commit()
        for orgStr in ["Cabinet of Ministers", "Office of Prime Minister", "the Foreign Affairs Committee"]:
            org = Organization()
            org.name = orgStr
            db.session.add(org)
            db.session.commit()

        persons = getPersonData()
        for person in persons:
            idx = random.randint(0, 2)
            org = Organization.find_all_organizes()[idx]
            addUser = User(
                # id=person['userid'],
                name=person['name'],
                branchOfGov=person['branchOfGov'],
                ministry=person['ministry'],
                position=person['position'],
                gender=person['gender'],
                age=person['age'],
                ancestry=person['ancestry'],
                ethnicity=person['ethnicity'],
                imageurl=person['imageurl'],
            )
            addUser.organizations.append(org)
            db.session.add(addUser)
            db.session.commit()


app = create_app()
app.app_context().push()

db.create_all(app=app)
add_data()
