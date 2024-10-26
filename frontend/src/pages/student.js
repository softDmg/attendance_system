import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import logo from '../images/iconN.png';  

export default function Student() {
  const navigate = useNavigate();
  const [studentDetails, setStudentDetails] = useState({
    name: '',
    number: '',
    image: ''
  });
  const [courses, setCourses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [studentData, setStudentData] = useState([]);
  const [statistics, setStatistics] = useState({
    sessions: 0,
    present: 0,
    absent: 0,
    late: 0,
    totalScore: 0,
  });

  useEffect(() => {
    const loggedInStudent = localStorage.getItem('loggedInStudent');
    if (loggedInStudent) {
      fetchStudentDetails(loggedInStudent);
      fetchCourses();
      fetchAcademicYears();
    }
  }, []);

  useEffect(() => {
    if (selectedAcademicYear) {
      fetchLogs();
    }
  }, [selectedAcademicYear, selectedCourse]);

  const fetchStudentDetails = (studentName) => {
    fetch(`http://127.0.0.1:5000/student/${studentName}`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch student details');
        return response.json();
      })
      .then(data => {
        setStudentDetails({
          name: data.name,
          number: data.studentNumber,
          image: `http://127.0.0.1:5000/faces/${data.imageFilename}`
        });
      })
      .catch(error => {
        console.error('Error fetching student details:', error);
        alert('An error occurred while fetching student details.');
      });
  };

  const fetchCourses = () => {
    fetch('http://127.0.0.1:5000/course')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch courses');
        return response.json();
      })
      .then(data => setCourses(data.courses))
      .catch(error => {
        console.error('Error fetching courses:', error);
        alert('An error occurred while fetching courses.');
      });
  };

  const fetchAcademicYears = () => {
    fetch('http://127.0.0.1:5000/academic_years')
      .then(response => response.json())
      .then(data => setAcademicYears(data.academicYears))
      .catch(() => alert('An error occurred while fetching academic years.'));
  };

  const fetchLogs = () => {
    let url = `http://127.0.0.1:5000/logs/${selectedAcademicYear}`;
    const params = selectedCourse !== 'all' ? [`course=${selectedCourse}`] : [];
    if (params.length) url += `?${params.join('&')}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setStudentData(data.logs);
        calculateStatistics(data.logs);
      })
      .catch(() => alert('An error occurred while fetching logs.'));
  };

  const calculateStatistics = (data) => {
    const sessions = data.length;
    const present = data.filter(entry => entry.status === 'Present').length;
    const absent = data.filter(entry => entry.status === 'Absent').length;
    const late = data.filter(entry => entry.status === 'Late').length;
    const totalScore = data.reduce((acc, entry) => acc + entry.score, 0);

    setStatistics({
      sessions,
      present,
      absent,
      late,
      totalScore,
    });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
  
    doc.setFontSize(12);
    doc.text(`Student: ${studentDetails.name}`, 10, 10);
    doc.text(`Student Number: ${studentDetails.number}`, 10, 20);
  
    // Add academic year, selected course
    doc.text(`Academic Year: ${selectedAcademicYear}`, 10, 30);
    doc.text(`Selected Course: ${selectedCourse}`, 10, 40);
  
    // Add table
    doc.autoTable({
      startY: 50,
      head: [['Date', 'Status', 'Score']],
      body: studentData.map(entry => [entry.class_date, entry.status, entry.score]),
    });
  
    // Add statistics
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 10,
      head: [['Number of Sessions', 'Present', 'Late', 'Absent', 'Total Score']],
      body: [[statistics.sessions, statistics.present, statistics.late, statistics.absent, statistics.totalScore]],
    });
  
    // Save PDF
    doc.save('report.pdf');
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
        <button className="studentlogout" onClick={handleLogout}>Log Out</button>
        <div className="student-header">
          
        </div>
      <div className="student-info">
        <label>Student Name: {studentDetails.name}</label>
        <label>Student Number: {studentDetails.number}</label>
        <div className="student-picture-frame">
          <img src={logo} alt="Studentlogo" />
        </div>
        <label>Academic Year:</label>
        <select value={selectedAcademicYear} onChange={(e) => setSelectedAcademicYear(e.target.value)}>
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
          <button onClick={downloadPDF}>Download Report</button>
          <button onClick={handleCheckSchedule}>Check Schedule</button>
        </div>
      </div>
    </div>
  );
}
