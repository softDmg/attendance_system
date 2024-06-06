import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../style.css'; // Ensure this file exists

const AttendancePage = () => {
  const [user] = useState('Admin');
  const [date, setDate] = useState(new Date());
  const [subject, setSubject] = useState('');
  const [studentList, setStudentList] = useState('All students');
  const [professor, setProfessor] = useState('');
  const [academicYear, setAcademicYear] = useState('2023-2024');
  const [tableData, setTableData] = useState([]);

  const subjects = ['Biometrics I', 'Course 1', 'Course 2']; // Sample subjects
  const students = ['All students', 'Student 1', 'Student 2']; // Sample students
  const professors = ['Amine Nait-ali', 'Professor 1', 'Professor 2']; // Sample professors

  useEffect(() => {
    // Fetch data for table or other initializations if necessary
    setTableData([
      { name: 'Muhammad Sule Maidawa', program: 'Program 1', attendanceDate: '', course: 'Biometrics I', status: 'On time' },
      { name: 'Sulaiman Waliu', program: 'Program 2', attendanceDate: '', course: 'Biometrics I', status: 'Late' }
    ]);
  }, []);

  return (
    <div id="bodyprof" className="attendance-container">
      <div id="prof-header">
        <div className="user-info">
          <label>User: </label><span>{user}</span>
        </div>
        <div className="date-picker">
          <label>Date: </label>
          <DatePicker selected={date} onChange={(date) => setDate(date)} dateFormat="dd/MM/yyyy" />
        </div>
      </div>

      <div className="controls">
        <div className="dropdowns">
          <label>Subject List: </label>
          <select id="course-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
            {subjects.map((subject, index) => (
              <option key={index} value={subject}>{subject}</option>
            ))}
          </select>

          <label>Student List: </label>
          <select id="student-list" value={studentList} onChange={(e) => setStudentList(e.target.value)}>
            {students.map((student, index) => (
              <option key={index} value={student}>{student}</option>
            ))}
          </select>
        </div>

        <div className="professor-info">
          <label>Professor: </label>
          <select id="professor-select" value={professor} onChange={(e) => setProfessor(e.target.value)}>
            {professors.map((prof, index) => (
              <option key={index} value={prof}>{prof}</option>
            ))}
          </select>
        </div>

        <div className="academic-year">
          <label>Academic Year: </label>
          <select id="academic-year" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}>
            <option value="2023-2024">2023-2024</option>
            <option value="2022-2023">2022-2023</option>
          </select>
          <button>Add Academic Year</button>
        </div>
      </div>

      <div className="table-container child-content">
        <table>
          <thead>
            <tr>
              <th>Student's name</th>
              <th>Program's name</th>
              <th>Attendance date</th>
              <th>Course</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{row.name}</td>
                <td>{row.program}</td>
                <td>{row.attendanceDate}</td>
                <td>{row.course}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div id="report-footer" className="footer-buttons">
        <button>Programs list</button>
        <button>Student list</button>
        <button>Courses List</button>
        <button>Professors list</button>
      </div>
    </div>
  );
};

export default AttendancePage;