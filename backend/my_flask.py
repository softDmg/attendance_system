from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

broker_url = "https://attendanceapi-i0pn.onrender.com/MySQLBroker"

def authenticate_user(username, password, role):
    if role not in ['admin', 'professor', 'student']:
        return False, 'Invalid role'

    req = ""
    if role == 'admin':
        req = "SELECT * FROM admin WHERE Name = '{}' AND Password = '{}'".format(username, password)
    elif role == 'professor':
        req = "SELECT * FROM professors WHERE Name = '{}' AND Password = '{}'".format(username, password)
    elif role == 'student':
        req = "SELECT * FROM student WHERE Name = '{}' AND Password = '{}'".format(username, password)

    mysql_data = {'mysql_command': req, 'is_write': False}
    response = requests.post(broker_url, json=mysql_data)
    response_data = response.json()

    if "result" in response_data:
        result = response_data["result"]
        if result:
            return True, 'User Login Successful'
        else:
            return False, 'User Login Failed'
    else:
        return False, 'Error occurred: No result found in response'

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        role = data.get('role')

        authenticated, message = authenticate_user(username, password, role)
        if authenticated:
            return jsonify({'message': message}), 200
        else:
            return jsonify({'message': message}), 401
    except Exception as e:
        return jsonify({'message': 'Error occurred', 'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)