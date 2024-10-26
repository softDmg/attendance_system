from flask import Flask, request, jsonify, send_from_directory
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
            req = "SELECT * FROM admin WHERE username = %s AND password = %s"
        elif role == 'professor':
            req = "SELECT * FROM professors WHERE Name = %s AND Password = %s"
        elif role == 'student':
            req = "SELECT * FROM students WHERE Name = %s AND Password = %s"

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
        return jsonify({'message':
                         'Error occurred', 'error': str(e)}), 500

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

@app.route('/students', methods=['GET'])
def get_all_students():
    try:
        connection = database()
        cursor = connection.cursor()
        cursor.execute("SELECT Name FROM `students 2022-2023`")
        students = [{'Name': row[0]} for row in cursor.fetchall()]
        cursor.close()
        connection.close()
        return jsonify({'students': students}), 200
    except Exception as e:
        traceback.print_exc()
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

        cursor.execute("UPDATE attendance SET delay_time = %s WHERE full_name = %s", (delay_time, student_name))
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({'message': 'Delay time updated successfully'}), 200
    except Exception as e:
        app.logger.error("An error occurred: {}".format(str(e)))
        return jsonify({'message': 'Error occurred', 'error': str(e)}), 500


# @app.route('/academic_years', methods=['GET'])
# def get_academic_years():
#     try:
#         connection = database()
#         cursor = connection.cursor()

#         # Fetch academic years from your logs tables
#         cursor.execute("SHOW TABLES LIKE 'logs%'")
#         tables = cursor.fetchall()
#         academic_years = [table[0].split()[-1] for table in tables]

#         cursor.close()
#         connection.close()

#         return jsonify({'academicYears': academic_years}), 200
#     except Exception as e:
#         traceback.print_exc()
#         return jsonify({'message': 'Error occurred', 'error': str(e)}), 500

@app.route('/academic_years', methods=['GET'])
def get_academic_years():
    try:
        connection = database()
        cursor = connection.cursor()

        # Fetch tables with names starting with 'logs'
        cursor.execute("SHOW TABLES LIKE 'logs %'")
        tables = cursor.fetchall()

        # Decode byte objects to strings and extract academic years
        academic_years = [table[0].decode('utf-8').split(' ')[1] for table in tables]

        cursor.close()
        connection.close()

        return jsonify({'academicYears': academic_years}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({'message': 'Error occurred', 'error': str(e)}), 500

@app.route('/logs/<academic_year>', methods=['GET'])
def get_logs(academic_year):
    try:
        student_name = request.args.get('student')
        course_name = request.args.get('course')
        connection = database()
        cursor = connection.cursor()
        table_name = f'logs {academic_year}'
        
        query = f"SELECT name, class_date, class_name, status, score, comment FROM `{table_name}` WHERE 1=1"
        params = []

        if student_name and academic_year in ['2021-2022', '2022-2023', '2023-2024']:
            query += " AND name = %s"
            params.append(student_name)
        
        if course_name != 'all':
            query += " AND class_name = %s"
            params.append(course_name)
        
        cursor.execute(query, params)
        logs = [{'name': row[0], 'class_date': row[1], 'class_name': row[2], 'status': row[3], 'score': row[4], 'comment': row[5]} for row in cursor.fetchall()]
        cursor.close()
        connection.close()
        return jsonify({'logs': logs}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({'message': 'Error occurred', 'error': str(e)}), 500

@app.route('/student/<studentName>', methods=['GET'])
def get_student_details(studentName):
    try:
        connection = database()
        cursor = connection.cursor()

        # Fetch student details from the student table
        cursor.execute("SELECT Name, studentNumber FROM students WHERE Name = %s", (studentName,))
        student_details = cursor.fetchone()

        cursor.close()
        connection.close()

        if student_details:
            return jsonify({'name': student_details[0], 'studentNumber': student_details[1]}), 200
        else:
            return jsonify({'message': 'Student not found'}), 404
    except Exception as e:
        traceback.print_exc()
        return jsonify({'message': 'Error occurred', 'error': str(e)}), 500


@app.route('/course', methods=['GET'])
def get_all_courses():
    try:
        connection = database()
        cursor = connection.cursor()

        # Fetch all courses from the courses table
        cursor.execute("SELECT Course FROM courses")
        courses = [row[0] for row in cursor.fetchall()]

        cursor.close()
        connection.close()

        return jsonify({'courses': courses}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({'message': 'Error occurred', 'error': str(e)}), 500


@app.route('/faces/<filename>')
def get_student_image(filename):
  
    filename_without_extension = os.path.splitext(filename)[0]

    for ext in ['jpg', 'jpeg', 'png', 'gif']:
        full_filename = f"{filename_without_extension}.{ext}"
        if os.path.exists(os.path.join('Faces', full_filename)):
          
            return send_from_directory('Faces', full_filename)

    return jsonify({'error': 'Image not found'}), 404








#////////////////////////////////// ADmin Page //////////////////////////////////
@app.route('/adminprofessors', methods=['GET'])
def adminget_professors():
    try:
        conn = database()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM professors")
        result = cursor.fetchall()
        conn.close()
        return jsonify(result)
    except Exception as e:
        return str(e), 500

@app.route('/adminprofessors', methods=['POST'])
def adminadd_professor():
    try:
        data = request.get_json()
        print(f"Incoming data: {data}")  # Debug statement to check the incoming data
        
        # Ensure correct extraction of fields based on the JSON structure
        name = data.get('name')  # Expecting lowercase field names
        password = data.get('password')
        permission = data.get('permission')  # Note: No longer using course

        # Validate input data
        if None in [name, password, permission]:  # Check for required fields
            return jsonify({'error': 'All fields are required'}), 400

        # Database connection and insertion
        conn = database()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO professors (Name, Password, Permision) VALUES (%s, %s, %s)", 
            (name, password, permission)
        )
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Professor added successfully'}), 201
    except Exception as e:
        print(f"Error: {e}")  # Print the error for debugging
        return jsonify({'error': 'Failed to add professor', 'details': str(e)}), 500

@app.route('/adminprofessors/<int:ID>', methods=['DELETE'])
def admindelete_professor(ID):
    try:
        conn = database()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM professors WHERE ID = %s", (ID,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Professor deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to delete professor', 'details': str(e)}), 500
    

@app.route('/adminprofessors/<int:ID>', methods=['PUT'])
def adminupdate_professor(ID):
    try:
        data = request.get_json()
        name = data.get('name')
        password = data.get('password')
        permission = data.get('permission')

        conn = database()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE professors SET Name = %s, Password = %s, Permision = %s WHERE ID = %s",
            (name, password, permission, ID)
        )
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Professor updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to update professor', 'details': str(e)}), 500

@app.route('/admincourses', methods=['GET'])
def adminget_courses():
    try:
        conn = database()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM courses")
        result = cursor.fetchall()
        conn.close()
        return jsonify(result)
    except Exception as e:
        return str(e), 500

@app.route('/admincourses', methods=['POST'])
def adminadd_course():
    try:
        data = request.get_json()
        course = data.get('course')
        professor = data.get('professor')
        program_name = data.get('program')

        conn = database()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO courses (Course, Professor, ProgramName) VALUES (%s, %s, %s)", (course, professor, program_name))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Course added successfully'}), 201
    except Exception as e:
        return jsonify({'error': 'Failed to add course', 'details': str(e)}), 500


@app.route('/admincourses/<int:ID>', methods=['DELETE'])
def admindelete_course(ID):
    try:
        conn = database()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM courses WHERE ID = %s", (ID,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Course deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to delete course', 'details': str(e)}), 500

@app.route('/adminstudents', methods=['GET'])
def adminget_students():
    try:
        conn = database()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM students")
        result = cursor.fetchall()
        conn.close()
        return jsonify(result)
    except Exception as e:
        return str(e), 500

@app.route('/adminstudents', methods=['POST'])
def adminadd_student():
    try:
        data = request.get_json()
        name = data.get('name')
        password = data.get('password')
        program = data.get('program')
        student_number = data.get('studentNumber')

        conn = database()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO students (Name, Password, Program, StudentNumber) VALUES (%s, %s, %s, %s)", 
                       (name, password, program, student_number))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Student added successfully'}), 201
    except Exception as e:
        return jsonify({'error': 'Failed to add student', 'details': str(e)}), 500

@app.route('/adminstudents/<int:id>', methods=['PUT'])
def adminupdate_student(id):
    try:
        data = request.get_json()
        name = data.get('name')
        password = data.get('password')
        program = data.get('program')
        student_number = data.get('studentNumber')

        conn = database()
        cursor = conn.cursor()
        cursor.execute("UPDATE students SET Name = %s, Password = %s, Program = %s, StudentNumber = %s WHERE ID = %s", 
                       (name, password, program, student_number, id))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Student updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to update student', 'details': str(e)}), 500
@app.route('/adminstudents/<int:ID>', methods=['DELETE'])
def admindelete_student(ID):
    try:
        conn = database()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM students WHERE ID = %s", (ID,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Student deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to delete student', 'details': str(e)}), 500



@app.route('/adminprograms', methods=['GET'])
def adminget_programs():
    try:
        conn = database()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM programs")
        result = cursor.fetchall()
        conn.close()
        return jsonify(result)
    except Exception as e:
        return str(e), 500
@app.route('/adminprograms', methods=['POST'])
def adminadd_program():
    try:
        data = request.get_json()
        program_name = data.get('program_name')

        conn = database()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO programs (ProgramName) VALUES (%s)", (program_name,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Program added successfully'}), 201
    except Exception as e:
        return jsonify({'error': 'Failed to add program', 'details': str(e)}), 500

@app.route('/adminprograms/<int:id>', methods=['PUT'])
def adminupdate_program(id):
    try:
        data = request.get_json()

        # Get the program name from the JSON payload (ensure this matches the frontend key)
        program_name = data.get('program_name')  # Key should be 'program_name' as sent from frontend

        if not program_name:
            return jsonify({'error': 'Program name is required'}), 400

        # Update the database using the correct column name (ProgramName)
        conn = database()
        cursor = conn.cursor()
        cursor.execute("UPDATE programs SET ProgramName = %s WHERE ID = %s", (program_name, id))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Program updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to update program', 'details': str(e)}), 500

    


@app.route('/adminprograms/<int:id>', methods=['DELETE'])
def admindelete_program(id):
    try:
        conn = database()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM programs WHERE ID = %s", (id,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Program deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to delete program', 'details': str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)