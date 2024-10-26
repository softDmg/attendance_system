import React, { useState, useEffect } from 'react';
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
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const loggedInProfessor = localStorage.getItem('loggedInProfessor');
    if (loggedInProfessor) {
      setProfessorName(loggedInProfessor);

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
          alert('An error occurred while fetching courses.');
        });
    }
  }, []);

  useEffect(() => {
    if (selectedCourse !== '') {
      fetchUpdatedStudentData(selectedCourse);
    }
  }, [selectedCourse]);

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
        console.log('Fetched student data:', data); 
        setStudentData(data.students);
      } else {
        console.error('Error fetching updated student data:', response.statusText);
        alert('An error occurred while fetching updated student data.');
      }
    } catch (error) {
      console.error('Error fetching updated student data:', error);
      alert('An error occurred while fetching updated student data.');
    }
  };

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

        // Poll for updated data
        const id = setInterval(async () => {
          await fetchUpdatedStudentData(selectedCourse);
        }, 5000);
        setIntervalId(id);
      } else {
        alert('Failed to start face recognition');
      }
    } catch (error) {
      console.error('Error during face recognition:', error);
      alert('An error occurred during face recognition.');
    }
  };

  const handleDelayTimeChange = async (event, index) => {
    const selectedStudent = studentData[index];
    const updatedStudent = { ...selectedStudent, delayTime: event.target.value };

    try {
      const response = await fetch('http://127.0.0.1:5000/update_delay_time', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          student_name: selectedStudent.name,
          delay_time: event.target.value
        })
      });

      if (response.ok) {
        const updatedStudentData = [...studentData];
        updatedStudentData[index] = updatedStudent;
        setStudentData(updatedStudentData);
      } else {
        alert('Failed to update delay time');
      }
    } catch (error) {
      console.error('Error updating delay time:', error);
      alert('An error occurred while updating delay time.');
    }
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <div>
      <header id="prof-header">
        <div className="navbar">
          <div className="left-buttons">
            <button onClick={() => navigate('/professor')}>Session</button>
            <button onClick={() => navigate('/report')}>Report</button>
          </div>
          <div className="right-buttons">
            <button onClick={() => {
              localStorage.removeItem('loggedInProfessor');
              navigate('/');
            }}>Log Out</button>
          </div>
        </div>
      </header>

      <div className="div-demo">
        <ul style={{ listStyle: 'none', padding: '0' }}>
          <li style={{ marginBottom: '10px' }}>
            <span>
              <label htmlFor="user" style={{ color: 'white' }}>User: {professorName}</label>
            </span>
          </li>
          <li>
            <span>
              <label htmlFor="course" style={{ color: 'white' }}>Course : </label>
              <select name="course" id="course-select" placeholder="course" onChange={(e) => setSelectedCourse(e.target.value)}>
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
          <label htmlFor="start-time" id='start-time' style={{ color: 'white' }}>Start Time : </label>
          <input type="time" name="start-time" id="start-time" value={startTime} onChange={handleStartTimeChange} required />
        </span>
        <span>
          <label htmlFor="accepted-delay" style={{ color: 'white' }}>Accepted Delay : </label>
          <input type="number" name="accepted-delay" id="accepted-delay" value={acceptedDelay} onChange={handleAcceptedDelayChange} required />
        </span>
      </div>
      <div className="contents">
        <div className="child-content">
          <img src={emptyclass} id="empty-classroom" alt="Empty classroom" />
        </div>
        <div className="child-content" style={{ color: 'white' }}>
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Attendance Status</th>
              </tr>
            </thead>
            <tbody>
              {studentData.map((student, index) => (
                <tr key={index}>
                  <td>{student.name}</td>
                  <td>
                    <select value={student.delayTime || 'Absent'} onChange={(e) => handleDelayTimeChange(e, index)}>
                      <option value="Absent">Absent</option>
                      <option value="present">Present</option>
                      <option value="late">Late</option>
                    </select>
                  </td>
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
        </div>
      </footer>
    </div>
  );
}
