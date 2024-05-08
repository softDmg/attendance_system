import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import emptyclass from '../images/empty_class.jpg';
import Webcam from 'react-webcam';

export default function ProfessorPage() {
  const navigate = useNavigate(); 
  const [professorName, setProfessorName] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [studentData, setStudentData] = useState([]);
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    const loggedInProfessor = localStorage.getItem('loggedInProfessor');
    if (loggedInProfessor) {
      setProfessorName(loggedInProfessor);
  
      // Fetch courses for the professor
      fetch(`http://127.0.0.1:5000/courses/${loggedInProfessor}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
    
          setCourses(data.courses);
        })
        .catch((error) => {
          console.error('Error fetching courses:', error);
          // Handle error gracefully
          alert('An error occurred while fetching courses.');
        });
    }
  }, []);

  useEffect(() => {
    if (selectedCourse !== '') {
      // Fetch student data for the selected course
      fetch(`http://127.0.0.1:5000/students/${selectedCourse}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setStudentData(data.students);
        })
        .catch((error) => {
          console.error('Error fetching student data:', error);
          alert('An error occurred while fetching student data.');
        });
    }
  }, [selectedCourse]);

  function handleSessionButtonClick() {
    navigate('/professor');
  }

  function handleReportButtonClick() {
    navigate('/report');
  }
  function handleCheckOnSiteButtonClick() {
    // Open a new window
    const cameraWindow = window.open('', 'Camera', 'width=640,height=480');
  
    // Create the necessary HTML elements
    const videoElement = document.createElement('video');
    videoElement.setAttribute('width', '640');
    videoElement.setAttribute('height', '480');
    cameraWindow.document.body.appendChild(videoElement);
  
    // Add an event listener for the user interaction
    cameraWindow.document.addEventListener('click', function() {
      // Access the user's camera and display the video feed
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
          videoElement.srcObject = stream;
          videoElement.play();
        })
        .catch(function(error) {
          console.error('Error accessing camera:', error);
        });
    });
  }

  return (
    <div>
      <header id="prof-header">
        <div className="navbar">
          <button onClick={handleSessionButtonClick}>Session</button>
          <button onClick={handleReportButtonClick}>Report</button>
        </div>
      </header>
      <div className="div-demo">
        <ul style={{lifestyleType: 'none', listStyle: 'none', padding: '0'}}>
          <li style={{marginBottom: '10px'}}>
            <span>
              <label htmlFor="user" style={{ color: 'white' }}>User: {professorName}</label>
            </span>
          </li>
          <li>
            <span>
              <label htmlFor="course" style={{color: 'white'}}>Course : </label>
              <select name="course" id="course-select" placeholder="course"  onChange={(e) => setSelectedCourse(e.target.value)}>
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
                
              </select>
            </span>
          </li>
        </ul>
        <span>
          <label htmlFor="start-time" id='start-time' style={{color: 'white'}}>Start Time : </label>
          <input type="time" defaultValue="00:00" id="start-time" placeholder="" />
        </span>
        <span>
          <label htmlFor="accepted-delay" style={{color: 'white'}}>Accepted Delay : </label>
          <input type="number" min="0" id="accepted-delay" max="15" placeholder="0" />
        </span>
      </div>
      <div className="contents">
        <div className="child-content">
          <img src={emptyclass} id="empty-classroom" alt="Empty classroom" />
        </div>
        <div className="child-content" style={{color: 'white'}}>
          <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Program Name</th>
                  <th>Delay Time</th>
                </tr>
              </thead>
              <tbody>
                {studentData.map((student, index) => (
                  <tr key={index}>
                    <td>{student.name}</td>
                    <td>{student.programName}</td>
                    <td>{student.delayTime}</td>
                  </tr>
                ))}
              </tbody>
          </table>
      </div>
        
      </div>
      <footer id="prof-footer">
        <div className="navbar">
          <button onClick={handleCheckOnSiteButtonClick}>Check On-Site</button>
          <button>Stop On-Site</button>
          <button>Check Zoom Sessions</button>
          <button>Check Teams Sessions</button>
          <button>Biometrics Registration</button>
        </div>
      </footer>
    </div>
  );
}