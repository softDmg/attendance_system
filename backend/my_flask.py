from flask import Flask, request, jsonify
from flask_cors import CORS
from face import recognize_faces
import requests
import logging
import traceback

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
        app.logger.error("An error occurred: {}".format(str(e)))
        return jsonify({'message': 'Error occurred', 'error': str(e)}), 500

@app.route('/courses/<professor>', methods=['GET'])
def get_courses(professor):
    try:
        app.logger.info("Retrieving courses for professor: {}".format(professor))
        
        # Query the database to retrieve the courses for the professor
        req = "SELECT Course FROM courses WHERE Professor = '{}'".format(professor)
        app.logger.info("MySQL request: {}".format(req))
        
        mysql_data = {'mysql_command': req, 'is_write': False}
        response = requests.post(broker_url, json=mysql_data)
        response_data = response.json()
        
        app.logger.info("Response data from MySQL broker: {}".format(response_data))

        if "result" in response_data:
            result = response_data["result"]
            app.logger.info("Result structure: {}".format(result))
            
            if isinstance(result, list):
                # Extract the course names from the result and return them as a list
                if len(result) > 0 and isinstance(result[0], list) and len(result[0]) > 0:
                    courses = [row[0] for row in result]
                    return jsonify({'courses': courses}), 200
                else:
                    return jsonify({'message': 'No courses found for the professor'}), 404
            else:
                return jsonify({'message': 'Error occurred: Invalid response format'}), 500
        else:
            return jsonify({'message': 'Error occurred: No result found in response'}), 500
    except Exception as e:
        traceback.print_exc()
        app.logger.error("An error occurred: {}".format(str(e)))
        return jsonify({'message': 'Error occurred', 'error': str(e)}), 500
    
@app.route('/students/<course>', methods=['GET'])
def get_students(course):
    try:
        app.logger.info("Retrieving students for course: {}".format(course))

        # Query the database to retrieve the students for the course
        req = """
        SELECT s.Name, s.ProgramName 
        FROM `students 2022-2023` s 
        INNER JOIN courses c ON s.ProgramName = c.ProgramName 
        WHERE c.Course = '{}'
        """.format(course)
        app.logger.info("MySQL request: {}".format(req))

        mysql_data = {'mysql_command': req, 'is_write': False}
        response = requests.post(broker_url, json=mysql_data)
        response_data = response.json()

        app.logger.info("Response data from MySQL broker: {}".format(response_data))

        if "result" in response_data:
            result = response_data["result"]
            app.logger.info("Result structure: {}".format(result))

            if isinstance(result, list):
                # Extract the student data from the result and return them as a list of dictionaries
                students = [{'name': row[0], 'programName': row[1]} for row in result]
                return jsonify({'students': students}), 200
            else:
                return jsonify({'message': 'Error occurred: Invalid response format'}), 500
        else:
            return jsonify({'message': 'Error occurred: No result found in response'}), 500
    except Exception as e:
        traceback.print_exc()
        app.logger.error("An error occurred: {}".format(str(e)))
        return jsonify({'message': 'Error occurred', 'error': str(e)}), 500

@app.route('/recognize', methods=['POST'])
def recognize():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'})

    image = request.files['image']
    image_path = f'{UNKNOWN_FACES_DIR}/{image.filename}'
    image.save(image_path)

    face_names = recognize_faces(image_path)

    return jsonify({'face_names': face_names})

if __name__ == "__main__":
    app.run(debug=True)