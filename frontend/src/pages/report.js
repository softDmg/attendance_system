import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReportPage() {
  const navigate = useNavigate();
  const [professorName, setProfessorName] = useState('');
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [academicYear, setAcademicYear] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');

  useEffect(() => {
    const loggedInProfessor = localStorage.getItem('loggedInProfessor');
    if (loggedInProfessor) {
      setProfessorName(loggedInProfessor);

      // Fetch courses for the professor
      fetch(`http://127.0.0.1:5000/courses/${loggedInProfessor}`)
        .then(response => response.json())
        .then(data => setCourses(data.courses))
        .catch(error => alert('An error occurred while fetching courses.'));

      // Fetch all students
      fetch('http://127.0.0.1:5000/students')
        .then(response => response.json())
        .then(data => setStudents(data.students))
        .catch(error => alert('An error occurred while fetching students.'));
    }
  }, []);

  useEffect(() => {
    const fetchLogs = () => {
      let url = `http://127.0.0.1:5000/logs/${academicYear}`;
      const params = [];
      
      if (selectedStudent !== 'all') {
        params.push(`student=${selectedStudent}`);
      }

      if (selectedCourse !== 'all') {
        params.push(`course=${selectedCourse}`);
      }

      if (params.length > 0) {
        url += '?' + params.join('&');
      }

      fetch(url)
        .then(response => response.json())
        .then(data => setStudentData(data.logs))
        .catch(error => alert('An error occurred while fetching logs.'));
    };

    if (academicYear) {
      fetchLogs();
    }
  }, [academicYear, selectedStudent, selectedCourse]);

  const handleLogout = () => {
    localStorage.removeItem('loggedInProfessor');
    navigate('/');
  };

  return (
    <div>
      <header id="prof-header">
        <div className="navbar">
          <div className="left-buttons">
            <button onClick={() => navigate('/professor')}>Session</button>
            <button onClick={() => navigate('/report')}>Report</button>
          </div>
          <div className="right-buttons">
            <button onClick={handleLogout}>Log Out</button>
          </div>
        </div>
      </header>

      <div className="div-demo">
        <ul style={{ listStyle: 'none', padding: '0', color: 'white' }}>
          <li style={{ marginBottom: '10px' }}>
            <label htmlFor="user" style={{ color: 'white' }}>User: {professorName}</label>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <label htmlFor="start-time">Date: </label>
            <input type="date" id="start-time" />
          </li>
          <li style={{ marginBottom: '10px', color: 'white' }}>
            <label htmlFor="student-list">Student List: </label>
            <select
              name="course"
              id="course-select"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="all">All Students</option>
              {students.map((student, index) => (
                <option key={index} value={student.Name}>{student.Name}</option>
              ))}
            </select>
          </li>
          <li style={{ marginBottom: '10px', color: 'white' }}>
            <label htmlFor="course">Subject List: </label>
            <select
              name="course"
              id="course-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="all">All Subjects</option>
              {courses.map((course, index) => (
                <option key={index} value={course}>{course}</option>
              ))}
            </select>
          </li>
        </ul>
        <span>
          <label style={{ marginBottom: '10px', color: 'white' }}>
            <label htmlFor="academic-year">Academic Year: </label>
            <select
              name="academic-year"
              id="academic-select"
              value={academicYear}
              onChange={(e) => {
                setAcademicYear(e.target.value);
                setSelectedStudent('all'); // Reset student selection when changing academic year
              }}
            >
              <option value="">Select Academic Year</option>
              <option value="2021-2022">2021-2022</option>
              <option value="2022-2023">2022-2023</option>
              <option value="2023-2024">2023-2024</option>
            </select>
          </label>
        </span>
      </div>

      <div className="child-content" style={{ color: 'white' }}>
        <table>
          <thead>
            <tr>
              <th>Student's Name</th>
              <th>Date</th>
              <th>Course</th>
              <th>Status</th>
              <th>Score</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {studentData.map((student, index) => (
              <tr key={index}>
                <td>{student.name}</td>
                <td>{student.class_date}</td>
                <td>{student.class_name}</td>
                <td>{student.status}</td>
                <td>{student.score}</td>
                <td>{student.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer id="report-footer">
        <div className="navbar">
          <label>Attendance number:</label>
          <label>Absence Number:</label>
          <label>Number of Sessions:</label>
          <button>More</button>
        </div>
      </footer>
    </div>
  );
}