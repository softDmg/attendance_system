// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import './admin.css';

// const Professors = ({ handleClose }) => {
//   const [professors, setProfessors] = useState([]);
//   const [newProfessor, setNewProfessor] = useState({ name: '', password: '', course: '' });
//   const [editing, setEditing] = useState(false);
//   const [currentProfessor, setCurrentProfessor] = useState({ id: null, name: '', password: '', course: '' });
//   const [courses, setCourses] = useState([]);

//   useEffect(() => {
//     fetchProfessors();
//     fetchCourses();
//   }, []);

//   const fetchProfessors = useCallback(() => {
//     axios.get('http://127.0.0.1:5000/adminprofessors')
//       .then(response => {
//         setProfessors(response.data);
//       })
//       .catch(error => {
//         console.error('There was an error fetching the professors!', error);
//       });
//   }, []);

//   const fetchCourses = useCallback(() => {
//     axios.get('http://127.0.0.1:5000/admincourses')
//       .then(response => {
//         setCourses(response.data);
//       })
//       .catch(error => {
//         console.error('There was an error fetching the courses!', error);
//       });
//   }, []);

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     if (editing) {
//       setCurrentProfessor({ ...currentProfessor, [name]: value });
//     } else {
//       setNewProfessor({ ...newProfessor, [name]: value });
//     }
//   };

//   const addProfessor = () => {
//     console.log('Adding professor:', newProfessor); 
//     axios.post('http://127.0.0.1:5000/adminprofessors', newProfessor)
//       .then(() => {
//         fetchProfessors();
//         setNewProfessor({ name: '', password: '', course: '' });
//       })
//       .catch(error => {
//         console.error('There was an error adding the professor!', error);
//       });
//   };

//   const updateProfessor = () => {
//     axios.put(`http://127.0.0.1:5000/adminprofessors/${currentProfessor.id}`, currentProfessor)
//       .then(() => {
//         fetchProfessors();
//         setEditing(false);
//         setCurrentProfessor({ id: null, name: '', password: '', course: '' });
//       })
//       .catch(error => {
//         console.error('There was an error updating the professor!', error);
//       });
//   };

//   const deleteProfessor = (id) => {
//     axios.delete(`http://127.0.0.1:5000/adminprofessors/${id}`)
//       .then(() => {
//         fetchProfessors();
//       })
//       .catch(error => {
//         console.error('There was an error deleting the professor!', error);
//       });
//   };

//   const handleSave = () => {
//     if (editing) {
//       updateProfessor();
//     } else if (newProfessor.name && newProfessor.password && newProfessor.course) {
//       addProfessor();
//     }
//     handleClose();
//   };

//   const editProfessor = (professor) => {
//     setEditing(true);
//     setCurrentProfessor({
//       id: professor.ID,
//       name: professor.Name,
//       password: professor.Password,
//       course: professor.Course
//     });
//   };

//   const handleCancel = () => {
//     setEditing(false);
//     setCurrentProfessor({ id: null, name: '', password: '', course: '' });
//     handleClose();
//   };

//   return (
//     <div className="professors-container">
//       <h2>Manage Professors</h2>
//       <div className="form-container">
//         <input
//           className='form-input'
//           type="text"
//           name="name"
//           placeholder="Name"
//           value={editing ? currentProfessor.name : newProfessor.name}
//           onChange={handleInputChange}
//         />
//         <input
//           className='form-input'
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={editing ? currentProfessor.password : newProfessor.password}
//           onChange={handleInputChange}
//         />
//         <select
//           className='form-select'
//           name="course"
//           value={editing ? currentProfessor.course : newProfessor.course}
//           onChange={handleInputChange}
//         >
//           <option value="">-Select Course-</option>
//           {courses.map(course => (
//             <option key={course.CourseID} value={course.CourseID}>{course.Course}</option>
//           ))}
//         </select>
//         {editing ? (
//           <button onClick={updateProfessor}>Update Professor</button>
//         ) : (
//           <button onClick={addProfessor}>Add Professor</button>
//         )}
//       </div>
//       <ul className="professors-list">
//           {professors.map((professor) => (
//             <li key={professor.ID}>
//               <span>{professor.Name}</span>
//               <span>{professor.Course}</span>
//               <span>{professor.Password}</span>
//               <button onClick={() => editProfessor(professor)}>Edit</button>
//               <button onClick={() => deleteProfessor(professor.ID)}>Delete</button>
//             </li>
//           ))}
//       </ul>
//       <div className="modal-footer">
//         <div className="button-container">
//           <button onClick={handleSave}>Save</button>
//           <button onClick={handleCancel}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Professors;
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './admin.css';

const Professors = ({ handleClose }) => {
  const [professors, setProfessors] = useState([]);
  const [newProfessor, setNewProfessor] = useState({ name: '', password: '', permission: 'Granted' });
  const [editing, setEditing] = useState(false);
  const [currentProfessor, setCurrentProfessor] = useState({ id: null, name: '', password: '', permission: 'Granted' });

  useEffect(() => {
    fetchProfessors();
  }, []);

  const fetchProfessors = useCallback(() => {
    axios.get('http://127.0.0.1:5000/adminprofessors')
      .then(response => {
        setProfessors(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the professors!', error);
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (editing) {
      setCurrentProfessor({ ...currentProfessor, [name]: value });
    } else {
      setNewProfessor({ ...newProfessor, [name]: value });
    }
  };

  const addProfessor = () => {
    axios.post('http://127.0.0.1:5000/adminprofessors', newProfessor)
      .then(() => {
        fetchProfessors();
        setNewProfessor({ name: '', password: '', permission: 'Granted' });
      })
      .catch(error => {
        console.error('There was an error adding the professor!', error);
      });
  };

  const updateProfessor = () => {
    axios.put(`http://127.0.0.1:5000/adminprofessors/${currentProfessor.id}`, currentProfessor)
      .then(() => {
        fetchProfessors();
        setEditing(false);
        setCurrentProfessor({ id: null, name: '', password: '', permission: 'Granted' });
      })
      .catch(error => {
        console.error('There was an error updating the professor!', error);
      });
  };

  const deleteProfessor = (id) => {
    axios.delete(`http://127.0.0.1:5000/adminprofessors/${id}`)
      .then(() => {
        fetchProfessors();
      })
      .catch(error => {
        console.error('There was an error deleting the professor!', error);
      });
  };

  const handleSave = () => {
    if (editing) {
      updateProfessor();
    } else if (newProfessor.name && newProfessor.password) {
      addProfessor();
    }
    handleClose();
  };

  const editProfessor = (professor) => {
    setEditing(true);
    setCurrentProfessor({
      id: professor.ID,
      name: professor.Name,
      password: professor.Password,
      permission: professor.Permision
    });
  };

  const handleCancel = () => {
    setEditing(false);
    setCurrentProfessor({ id: null, name: '', password: '', permission: 'Granted' });
    handleClose();
  };

  return (
    <div className="professors-container">
      <h2>Manage Professors</h2>
      <div className="form-container">
        <input
          className='form-input'
          type="text"
          name="name"
          placeholder="Name"
          value={editing ? currentProfessor.name : newProfessor.name}
          onChange={handleInputChange}
        />
        <input
          className='form-input'
          type="password"
          name="password"
          placeholder="Password"
          value={editing ? currentProfessor.password : newProfessor.password}
          onChange={handleInputChange}
        />
        <select
          className='form-select'
          name="permission"
          value={editing ? currentProfessor.permission : newProfessor.permission}
          onChange={handleInputChange}
        >
          <option value="Granted">Granted</option>
          <option value="Denied">Denied</option>
        </select>
        {editing ? (
          <button onClick={updateProfessor}>Update Professor</button>
        ) : (
          <button onClick={addProfessor}>Add Professor</button>
        )}
      </div>
      <ul className="professors-list">
          {professors.map((professor) => (
            <li key={professor.ID}>
              <span>{professor.Name}</span>
              <span>{professor.Permision}</span>
              <button onClick={() => editProfessor(professor)}>Edit</button>
              <button onClick={() => deleteProfessor(professor.ID)}>Delete</button>
            </li>
          ))}
      </ul>
      <div className="modal-footer">
        <div className="button-container">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Professors;
