import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Student() {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [academicYear, setAcademicYear] = useState('');
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('all');

  useEffect(() => {
    const loggedInStudent = localStorage.getItem('loggedInStudent');
    console.log('loggedInStudent:', loggedInStudent);
    if (loggedInStudent) {
      fetchStudentDetails(loggedInStudent);
      //   setStudentName(loggedInStudent);
      fetchCourses();
      fetchAcademicYears();
    }
  }, []);
  


  useEffect(() => {
    if (academicYear) {
      fetchLogs();
    }
  }, [academicYear, selectedCourse]);

  const fetchStudentDetails = (studentName) => {
    fetch(`http://127.0.0.1:5000/student/${studentName}`)
      .then(response => response.json())
      .then(data => {
        setStudentName(data.name);
        setStudentNumber(data.studentNumber);
      })
      .catch(() => alert('An error occurred while fetching student details.'));
  };

  const fetchCourses = () => {
    fetch('http://127.0.0.1:5000/courses')
      .then(response => response.json())
      .then(data => setCourses(data.courses))
      .catch(() => alert('An error occurred while fetching courses.'));
  };

  const fetchAcademicYears = () => {
    fetch('http://127.0.0.1:5000/academic_years')
      .then(response => response.json())
      .then(data => setAcademicYears(data.academicYears))
      .catch(() => alert('An error occurred while fetching academic years.'));
  };

  const fetchLogs = () => {
    let url = `http://127.0.0.1:5000/logs/${academicYear}`;
    const params = [];

    if (selectedCourse !== 'all') {
      params.push(`course=${selectedCourse}`);
    }

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    fetch(url)
      .then(response => response.json())
      .then(data => setStudentData(data.logs))
      .catch(() => alert('An error occurred while fetching logs.'));
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInStudent');
    navigate('/');
  };

  const handleCheckSchedule = () => {
    const scheduleUrl = 'https://www.international-master-biometrics-intelligent-vision.org/schedule-master-1';
    const password = '2024';
    window.open(`${scheduleUrl}?password=${password}`, '_blank');
  };

  return (
    <div>
      <header id="prof-header">
        <div className="right-buttons">
          <button onClick={handleLogout}>Log Out</button>
        </div>
      </header>
      <div className="student-info">
        <label>Student Name: {studentName} </label>
    
        <label>Student Number: {studentNumber}</label>

        <div className="student-picture-frame">
          {students.length > 0 && students[0]?.pictureUrl ? (
            <img src={students[0].pictureUrl} alt="Student" />
          ) : (
            <div className="placeholder">No Image Available</div>
          )}
        </div>
        <label>Academic Year:</label>
        <select value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}>
          <option value="">Select Academic Year</option>
          {academicYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <label>Course:</label>
        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
          <option value="all">All Courses</option>
          {courses.map(course => (
            <option key={course} value={course}>{course}</option>
          ))}
        </select>
        <div className="buttons">
          <button onClick={() => alert('Download report feature is not implemented yet.')}>Download Report</button>
          <button onClick={handleCheckSchedule}>Check Schedule</button>
        </div>
      </div>
    </div>
  );
} 