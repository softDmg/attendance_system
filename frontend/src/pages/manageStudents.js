import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './admin.css';

const ManageStudents = ({ handleClose }) => {
  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', studentNumber: '', program: '', password: '' });
  const [editing, setEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({ id: null, name: '', studentNumber: '', program: '', password: '' });

  useEffect(() => {
    fetchStudents();
    fetchPrograms();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/adminstudents');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/adminprograms');
      setPrograms(response.data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editing) {
      setCurrentStudent({ ...currentStudent, [name]: value });
    } else {
      setNewStudent({ ...newStudent, [name]: value });
    }
  };

  const addStudent = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/adminstudents', newStudent);
      fetchStudents();
      setNewStudent({ name: '', studentNumber: '', password: '', program: '' });
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const updateStudent = async () => {
    try {
      await axios.put(`http://127.0.0.1:5000/adminstudents/${currentStudent.id}`, currentStudent);
      fetchStudents();
      setEditing(false);
      setCurrentStudent({ id: null, name: '', studentNumber: '', password: '', program: '' });
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleSave = () => {
    if (editing) {
      updateStudent();
    } else if (newStudent.name && newStudent.studentNumber && newStudent.password && newStudent.program) {
      addStudent();
    }
    handleClose();
  };

  const handleCancel = () => {
    setEditing(false);
    setCurrentStudent({ id: null, name: '', studentNumber: '', program: '', password: '' });
    handleClose();
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/adminstudents/${id}`);
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  return (
    <div className="manage-students">
      <h2>Manage Students</h2>
      <div className="form-container">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={editing ? currentStudent.name : newStudent.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="password"
          placeholder="Password"
          value={editing ? currentStudent.password : newStudent.password}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="studentNumber"
          placeholder="Student Number"
          value={editing ? currentStudent.studentNumber : newStudent.studentNumber}
          onChange={handleInputChange}
        />
        <select
          name="program"
          value={editing ? currentStudent.program : newStudent.program}
          onChange={handleInputChange}
        >
          <option value="">-Select Program-</option>
          {programs.map(program => (
            <option key={program.ID} value={program.ProgramName}>{program.ProgramName}</option>
          ))}
        </select>
        {editing ? (
          <button onClick={updateStudent}>Update Student</button>
        ) : (
          <button onClick={addStudent}>Add Student</button>
        )}
      </div>
      <ul className="students-list">
        {students.map(student => (
          <li key={student.ID}>
            <span>{student.Name}</span>
            <span>{student.studentNumber}</span>
            <span>{student.Program}</span>
            <button onClick={() => {
              setEditing(true);
              setCurrentStudent({ id: student.ID, name: student.Name, studentNumber: student.studentNumber, program: student.Program, password: student.Password });
            }}>Edit</button>
            <button onClick={() => deleteStudent(student.ID)}>Delete</button>
          </li>
        ))}
      </ul>
      <div className="modal-footer">
        <div className="button-container">
          <button onClick={handleSave}>Save</button>
          <button className="cancel" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ManageStudents;
