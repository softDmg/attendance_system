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
  const [statistics, setStatistics] = useState({
    sessions: 0,
    present: 0,
    absent: 0,
    late: 0,
    totalScore: 0,
  });

  useEffect(() => {
    const loggedInProfessor = localStorage.getItem('loggedInProfessor');
    if (loggedInProfessor) {
      setProfessorName(loggedInProfessor);

      fetch(`http://127.0.0.1:5000/courses/${loggedInProfessor}`)
        .then(response => response.json())
        .then(data => setCourses(data.courses))
        .catch(error => alert('An error occurred while fetching courses.'));

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

  useEffect(() => {
    const calculateStatistics = () => {
      const sessions = studentData.length;
      const present = studentData.filter(entry => entry.status === 'Present').length;
      const absent = studentData.filter(entry => entry.status === 'Absent').length;
      const late = studentData.filter(entry => entry.status === 'Late').length;
      const totalScore = studentData.reduce((acc, entry) => acc + entry.score, 0);

      setStatistics({
        sessions,
        present,
        absent,
        late,
        totalScore,
      });
    };

    calculateStatistics();
  }, [studentData]);

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
                setSelectedStudent('all'); 
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
              <th>Date</th>
              <th>Status</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {studentData.map((student, index) => (
              <tr key={index}>
                <td>{student.class_date}</td>
                <td>{student.status}</td>
                <td>{student.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer id="report-footer">
        <div className="navbar">
          <label>Number of Sessions: {statistics.sessions}</label>
          <label>Present: {statistics.present}</label>
          <label>Late: {statistics.late}</label>
          <label>Absent: {statistics.absent}</label>
          <label>Total Score: {statistics.totalScore}</label>
          <button>Download Report</button>
        </div>
      </footer>
    </div>
  );
}
