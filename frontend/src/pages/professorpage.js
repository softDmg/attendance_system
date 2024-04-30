import React from 'react';
import { useNavigate } from 'react-router-dom';
import emptyclass from '../images/empty_class.jpg';

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
        <ul style={{lifestyleType: 'none', listStyle: 'none', padding: '0'}}>
          <li style={{marginBottom: '10px'}}>
            <span>
              <label htmlFor="user" style={{color: 'white'}}>User : Professor Name </label>
            </span>
          </li>
          <li>
            <span>
              <label htmlFor="course" style={{color: 'white'}}>Course : </label>
              <select name="course" id="course-select" placeholder="course" >
                <option value="course1">Select Course</option>
                <option value="course1">Course 1</option>
                <option value="course1">Course 2</option>
                <option value="course1">Course 3</option>
                <option value="course1">Course 4</option>
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
              <th>Name</th>
              <th>Delays (Minutes)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Muhammad Sule Maidawa</td>
              <td>5</td>
            </tr>
            <tr>
              <td>Sulaiman Waliu</td>
              <td>10</td>
            </tr>
            
          </tbody>
        </table>
      </div>
        
      </div>
      <footer id="prof-footer">
        <div className="navbar">
          <button>Check On-Site</button>
          <button>Stop On-Site</button>
          <button>Check Zoom Sessions</button>
          <button>Check Teams Sessions</button>
          <button>Biometrics Registration</button>
        </div>
      </footer>
    </div>
  );
}