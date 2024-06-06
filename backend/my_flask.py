from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import logging
import traceback
import subprocess
import os

app = Flask(__name__)
CORS(app)

def database():
    return mysql.connector.connect(
        host="na424056-001.eu.clouddb.ovh.net",
        user="innov-app1",
        password="Ryr50IUfFm07",
        database="StudentAttendance",
        port=35700
    )

def authenticate_user(username, password, role):
    try:
        connection = database()
        cursor = connection.cursor()

        if role not in ['admin', 'professor', 'student']:
            return False, 'Invalid role'

        req = ""
        if role == 'admin':
            req = "SELECT * FROM admin WHERE Name = %s AND Password = %s"
        elif role == 'professor':
            req = "SELECT * FROM professors WHERE Name = %s AND Password = %s"
        elif role == 'student':
            req = "SELECT * FROM student WHERE Name = %s AND Password = %s"

        cursor.execute(req, (username, password))
        result = cursor.fetchone()

        cursor.close()
        connection.close()

        if result:
            return True, 'User Login Successful'
        else:
            return False, 'User Login Failed'

    except Exception as e:
        return False, 'Error occurred: {}'.format(str(e))

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
        
        connection = database()
        cursor = connection.cursor()
        
        req = "SELECT Course FROM courses WHERE Professor = %s"
        cursor.execute(req, (professor,))
        result = cursor.fetchall()
        
        cursor.close()
        connection.close()

        if result:
            courses = [row[0] for row in result]
            return jsonify({'courses': courses}), 200
        else:
            return jsonify({'message': 'No courses found for the professor'}), 404
    except Exception as e:
        traceback.print_exc()
        app.logger.error("An error occurred: {}".format(str(e)))
        return jsonify({'message': 'Error occurred', 'error': str(e)}), 500

@app.route('/students/<course>', methods=['GET'])
def get_students(course):
    try:
        app.logger.info("Retrieving students for course: {}".format(course))

        connection = database()
        cursor = connection.cursor()

        req = """
        SELECT s.Name, s.ProgramName, a.delay_time
        FROM `students 2022-2023` s 
        INNER JOIN courses c ON s.ProgramName = c.ProgramName 
        LEFT JOIN attendance a ON s.Name = a.full_name
        WHERE c.Course = %s
        """
        cursor.execute(req, (course,))
        result = cursor.fetchall()

        cursor.close()
        connection.close()

        if result:
            students = [{'name': row[0], 'programName': row[1], 'delayTime': row[2]} for row in result]
            return jsonify({'students': students}), 200
        else:
            return jsonify({'message': 'No students found for the course'}), 404
    except Exception as e:
        traceback.print_exc()
        app.logger.error("An error occurred: {}".format(str(e)))
        return jsonify({'message': 'Error occurred', 'error': str(e)}), 500

@app.route('/start_face_recognition', methods=['POST'])
def start_face_recognition():
    try:
        data = request.json
        app.logger.info(f"Received payload: {data}")
        start_time = data.get('start_time')
        accepted_delay = data.get('accepted_delay')

        if not start_time or not accepted_delay:
            app.logger.error("Missing start_time or accepted_delay in the payload")
            return jsonify({'message': 'Start time and accepted delay are required'}), 400

        subprocess.Popen(['python', 'face.py', start_time, str(accepted_delay)], cwd=os.path.dirname(__file__))

        return jsonify({'message': 'Face recognition started'}), 200
    except Exception as e:
        app.logger.error("An error occurred: {}".format(str(e)))
        return jsonify({'message': 'Error occurred', 'error': str(e)}), 500


@app.route('/update_delay_time', methods=['POST'])
def update_delay_time():
    try:
        data = request.json
        student_name = data.get('student_name')
        delay_time = data.get('delay_time')

        connection = database()
        cursor = connection.cursor()

        # Update delay time for the student
        cursor.execute("UPDATE attendance SET delay_time = %s WHERE full_name = %s", (delay_time, student_name))
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({'message': 'Delay time updated successfully'}), 200
    except Exception as e:
        app.logger.error("An error occurred: {}".format(str(e)))
        return jsonify({'message': 'Error occurred', 'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)