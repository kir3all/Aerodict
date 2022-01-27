import os
from random import randint
from functools import wraps
from flask import Flask, make_response, request, g, jsonify, redirect, url_for
from datetime import datetime, timedelta
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3

import jwt
# from flask_jwt_extended import (
#     create_access_token, set_access_cookies,
#     unset_jwt_cookies
# )
# breakpoint()
DATABASE = './database.db'
UPLOAD_FOLDER = './static/img'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# app.config['JWT_ACCESS_COOKIE_NAME'] = 'access_token_cookie'
# app.config['JWT_COOKIE_SECURE'] = False
# app.config['JWT_TOKEN_LOCATION'] = ['cookies']
# app.config['JWT_COOKIE_DOMAIN'] = '192.168.1.219'
# app.config['JWT_ACCESS_COOKIE_PATH'] = '/api/admin/'
# app.config['JWT_COOKIE_SAMESITE'] = "None"
# app.config['JWT_COOKIE_CSRF_PROTECT'] = False
if 'SECRET_KEY' in os.environ:
    app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
else:
    raise Exception('No secret key in env')
if 'ADMIN_PASSWORD' in os.environ:
    master_pass = generate_password_hash(os.environ['ADMIN_PASSWORD'])
else:
    raise Exception('No admin password in env')
# Enable csrf double submit protection. See this for a thorough
# explanation: http://www.redotheweb.com/2015/11/09/api-security.html
# admin part

html_header = '''<div><a href="/api/admin/logout">logout</a></div>
        <div><a href="/api/admin/show_all">show all</a></div>
        <div><a href="/api/admin/delete_card">delete card</a></div>
        <div><a href="/api/admin/add_card">add card</a></div>'''


def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # jwt is passed in the request header
        if 'access_token_cookie' in request.cookies:
            token = request.cookies['access_token_cookie']
        # return 401 if token is not passed
        # breakpoint()
        if not token:
            return redirect(url_for('login'))

        try:
            # decoding the payload to fetch the stored details
            data = jwt.decode(
                token, app.config['SECRET_KEY'], algorithms='HS256')
        except:
            return redirect(url_for('login'))
        # returns the current logged in users contex to the routes
        return f(*args, **kwargs)

    return decorated


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE, isolation_level=None)
    return db


def encode_auth_token(user_id):
    """
    Generates the Auth Token
    :return: string
    """
    try:
        payload = {
            'exp': datetime.utcnow() + timedelta(days=1),
            'iat': datetime.utcnow(),
            'sub': user_id
        }
        return jwt.encode(
            payload,
            app.config.get('SECRET_KEY'),
            algorithm='HS256'
        )
    except Exception as e:
        # breakpoint()
        return ''


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


@app.route("/api/admin/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        password = request.form.get('password')
        # breakpoint()
        if not password:
            return redirect(url_for('login'))
        if not check_password_hash(master_pass, password):
            return redirect(url_for('login'))
        access_token = encode_auth_token('admin')
        if access_token == '':
            return redirect(url_for('login'))
        resp = jsonify({'login': True})
        resp.set_cookie('access_token_cookie',
                        access_token)
        resp.location = url_for('show_all')
        return resp, 302
    else:
        return '''
           <form method="POST" enctype="multipart/form-data">
               <div><label>Password<input type="password" name="password"></label></div>
               <input type="submit" value="Submit">
           </form>'''


@app.route('/api/admin/logout', methods=['GET'])
def logout():
    resp = jsonify({'logout': True})
#     breakpoint()
    resp.delete_cookie('access_token_cookie')
    return redirect(url_for('login'))


@app.route("/api/admin/show_all", methods=['GET'])
@jwt_required
def show_all():
    cur = get_db().cursor()
    all_items = cur.execute('SELECT * FROM quiz').fetchall()
    cur.close()
    html_all = ''
    for each in all_items:
        html_all += '''<div style="background:silver;"><h3>id={}</h3>
                    <p>title={}</p>
                    <p>text={}</p>
                    <img src={} alt="uploaded file" width="345" height="140" style="object-fit: cover;">
                    <p>description={}</p>
                    <p>answer={}</p></div>'''.format(each[0], each[1], each[2], '/' + each[3], each[4], each[5])
    return html_header + '<div>'+html_all+'</div>'


@app.route("/api/admin/add_card", methods=['GET', 'POST'])
@jwt_required
def add_card():
    if request.method == 'POST':
        if 'file' not in request.files:
            img = ''
        else:
            file = request.files['file']
            if file.filename == '':
                img = ''
            if file:
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                img = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                print(img)
        title = request.form.get('title')
        text = request.form.get('text')
        answer = request.form.get('answer')
        description = request.form.get('description')
        cur = get_db().cursor()
        command = 'INSERT INTO quiz (title, text, img, description, answer) VALUES ("{}", "{}", "{}", "{}", "{}")'.format(
            title, text, img[2:], description, answer)
        # breakpoint()
        cur.execute(command)
        cur.close()

        return html_header + '''
                    <a href='/api/admin/add_card'>Back</a>
                    <h1>Title: {}</h1>
                    <h1>Text: {}</h1>
                    <img src={} alt="uploaded file">'''.format(title, text, '/' + img)

    return html_header + '''
           <form method="POST" enctype="multipart/form-data">
               <div><label>Title: <input type="text" name="title"></label></div>
               <div><label>Text: <input type="text" name="text"></label></div>
               <div><label>Answer: <input type="text" name="answer"></label></div>
               <div><label>Descripton: <input type="text" name="description"></label></div>
               <div><label>Img: <input type="file" name="file"></label></div>
               <input type="submit" value="Submit">
           </form>'''


@app.route("/api/admin/delete_card", methods=['GET', 'POST'])
@jwt_required
def delete_card():
    if request.method == 'POST':
        id = request.form.get('id')
        cur = get_db().cursor()
        cur.execute(
            'DELETE FROM quiz WHERE id={}'.format(id)).fetchall()
        cur.close()

        return html_header + '''
                    <h1>Deleted: {}</h1>
                   '''.format(id)

    return html_header + '''
           <form method="POST">
               <div><label>ID: <input type="text" name="id"></label></div>
               <input type="submit" value="Submit">
           </form>'''

# user part


@app.route("/api/get_question")
def get_question():
    dt = {
        "id": 1,
        "title": "test",
        "text": "test",
        "img": "img/test.jpg",
        "answer": "yes",
        "description": "hfjhdgfvjhdhjfvd"
    }
    cur = get_db().cursor()
    all_items = cur.execute('SELECT * FROM quiz').fetchall()
    cur.close()
    # breakpoint()
    if len(all_items) == 0:
        return make_response({"question": {
            "id": dt["id"],
            "title": dt["title"],
            "text": dt["text"],
            "img": dt["img"],
        }
        })
    else:
        index = randint(0, len(all_items) - 1)
        current = all_items[index]
        # breakpoint()
        return make_response({"question": {
            "id": current[0],
            "title": current[1],
            "text": current[2],
            "img": current[3],
        }
        })


@app.route("/api/check_answer", methods=['POST'])
def check_answer():
    dt = {
        "answer": "yes",
        "description": "hfjhdgfvjhdhjfvd"
    }
    id = request.form.get('id')
    answer = request.form.get('answer')
    cur = get_db().cursor()
    item = cur.execute('SELECT * FROM quiz WHERE id={}'.format(id)).fetchall()
    cur.close()
    # breakpoint()
    if item is not []:
        dt['answer'] = item[0][5]
        dt['description'] = item[0][4]
    resp = {"result": {"answer": True, "description": dt["description"]}}
    if answer == dt["answer"]:
        return make_response(resp)
    else:
        resp["result"]["answer"] = False
        return make_response(resp)
