import React from 'react';
import { useNavigate } from 'react-router-dom';
// import emptyclass from '../images/empty_class.jpg';

export default function ProfessorPage() {
  const navigate = useNavigate();

  function handleSessionButtonClick() {
    navigate('/professor');
  }

  function handleReportButtonClick() {
    navigate('/report');
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
        <ul style={{lifestyleType: 'none', listStyle: 'none', padding: '0', color: 'white'}}>
          <li style={{marginBottom: '10px'}}>
            <label htmlFor="user">User :  Prof Name</label>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <label htmlFor="start-time">Date : </label>
            <input type="date" id="start-time" />
          </li>
          <li style={{marginBottom: '10px', color: 'white'}}>
            <label htmlFor="course">Student List: </label>
            <select name="course" id="course-select" placeholder="course">
              <option value="course1">All Students</option>
              <option value="course1">Stydent 1</option>
              <option value="course1">Stydent 2</option>
              <option value="course1">Stydent 3</option>
              <option value="course1">Stydent 4</option>
            </select>
          </li>
          <li style={{marginBottom: '10px', color: 'white'}}>
            <label htmlFor="course">Subject List : </label>
            <select name="course" id="course-select" placeholder="course">
              <option value="course1">All Subjects</option>
              <option value="course1">Subject 1</option>
              <option value="course1">Subject 2</option>
              <option value="course1">Subject 3</option>
              <option value="course1">subject 4</option>
            </select>
          </li>
        </ul>
        <span>
          <label htmlFor="checkbox" style={{color: 'white'}} >Semeter : </label>
          <input type="checkbox" id="checkbox" /> <br/>
          
          <label style={{color: 'white'}}> Academic Year : </label>
          <select name="academic-year" id="academic-year" placeholder="academic-year">
            <option value="semeter1">2021-2022</option>
            <option value="semeter2">2022-2023</option>
            <option value="semeter3">2023-2024</option>
          </select>
        </span>
      </div>
      <div className="child-content" style={{color: 'white'}} >
        <table>
          <thead>
            <tr>
              <th>Student's Name</th>
              <th>Groups</th>
              <th>Date</th>
              <th>Course</th>
              <th>Status</th>
              <th>Score</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>JMuhammad Sule Maidawa</td>
              <td>5</td>
            </tr>
            <tr>
              <td>Sulaiman Waliu</td>
              <td>10</td>
            </tr>
            
          </tbody>
        </table>
      </div>
      <footer id="report-footer">
        <div className="navbar">
          <label>Attendance number : </label>
          <label>Absense Number : </label>
          <label>Number of Sessions : </label>
          <button>More</button>
        </div>
      </footer>
    </div>
  );
}