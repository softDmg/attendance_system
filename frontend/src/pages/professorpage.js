import React from 'react';
import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import emptyclass from '../images/empty_class.jpg';

export default function ProfessorPage() {
  const navigate = useNavigate(); 
  const [professorName, setProfessorName] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [studentData, setStudentData] = useState([]);
  const [startTime, setStartTime] = useState('');  
  const [acceptedDelay, setAcceptedDelay] = useState('');  

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
 
  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleAcceptedDelayChange = (event) => {
    setAcceptedDelay(event.target.value);
  };


  const handleFaceRecognition = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/start_face_recognition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ start_time: startTime, accepted_delay: acceptedDelay })
      });
  
      if (response.ok) {
        alert('Face recognition started');
  
        // Fetch updated student data
        const updatedStudentData = await fetchUpdatedStudentData(selectedCourse);
        setStudentData(updatedStudentData);
      } else {
        alert('Failed to start face recognition');
      }
    } catch (error) {
      console.error('Error during face recognition:', error);
      alert('An error occurred during face recognition.');
    }
  };
  
  const fetchUpdatedStudentData = async (course) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/students/${course}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        return data.students;
      } else {
        console.error('Error fetching updated student data:', response.statusText);
        alert('An error occurred while fetching updated student data.');
        return [];
      }
    } catch (error) {
      console.error('Error fetching updated student data:', error);
      alert('An error occurred while fetching updated student data.');
      return [];
    }
  };
  
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
          <input type="time" name= "start-time" id="start-time" value={startTime} onChange={handleStartTimeChange} required />
        </span>
        <span>
          <label htmlFor="accepted-delay" style={{color: 'white'}}>Accepted Delay : </label>
          <input type="number" name= "accepted-delay" id="accepted-delay" value={acceptedDelay} onChange={handleAcceptedDelayChange} required />
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
                    <td>{student.delayTime}</td> {/* Display the delay_time here */}
                  </tr>
                ))}
              </tbody>
          </table>
      </div>
        
      </div>
      <footer id="prof-footer">
        <div className="navbar">
          <button onClick={handleFaceRecognition} className='btn btn-primary'>Check On-Site</button>
          <button>Stop On-Site</button>
          <button>Check Zoom Sessions</button>
          <button>Check Teams Sessions</button>
          <button>Biometrics Registration</button>
        </div>
      </footer>
    </div>
  );
}