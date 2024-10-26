// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import './admin.css';

// const Courses = ({ handleClose }) => {
//   const [courses, setCourses] = useState([]);
//   const [programs, setPrograms] = useState([]);
//   const [newCourse, setNewCourse] = useState({ course: '', program: '' });
//   const [editing, setEditing] = useState(false);
//   const [currentCourse, setCurrentCourse] = useState({ id: null, course: '', program: '' });

//   useEffect(() => {
//     fetchCourses();
//     fetchPrograms();
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

//   const fetchPrograms = useCallback(() => {
//     axios.get('http://127.0.0.1:5000/adminprograms')
//       .then(response => {
//         setPrograms(response.data);
//       })
//       .catch(error => {
//         console.error('There was an error fetching the programs!', error);
//       });
//   }, []);

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     if (editing) {
//       setCurrentCourse({ ...currentCourse, [name]: value });
//     } else {
//       setNewCourse({ ...newCourse, [name]: value });
//     }
//   };

//   const addCourse = () => {
//     axios.post('http://127.0.0.1::5000/admincourses', newCourse)
//       .then(() => {
//         fetchPrograms();
//         fetchCourses();
//         setNewCourse({ course: '', program: '' });
//       })
//       .catch(error => {
//         console.error('There was an error adding the course!', error);
//       });
//   };

//   const updateCourse = () => {
//     axios.put(`http://127.0.0.1::5000/admincourses/${currentCourse.id}`, currentCourse)
//       .then(() => {
//         fetchPrograms();
//         fetchCourses();
//         setEditing(false);
//         setCurrentCourse({ id: null, course: '', program: '' });
//       })
//       .catch(error => {
//         console.error('There was an error updating the course!', error);
//       });
//   };

//   const deleteCourse = (id) => {
//     axios.delete(`http://127.0.0.1::5000/admincourses/${id}`)
//       .then(() => {
//         fetchCourses();
//       })
//       .catch(error => {
//         console.error('There was an error deleting the course!', error);
//       });
//   };

//   const handleSave = () => {
//     if (editing) {
//       updateCourse();
//     } else if (newCourse.course && newCourse.program) {
//       addCourse();
//     }
//     handleClose();
//   };

//   const editCourse = (course) => {
//     setEditing(true);
//     setCurrentCourse({ id: course.ID, course: course.Course, program: course.Program });
//   };

//   const handleCancel = () => {
//     setEditing(false);
//     setCurrentCourse({ id: null, course: '', program: '' });
//     handleClose();
//   };

//   return (
//     <div className="courses-container">
//       <h2>Manage Courses</h2>
//       <div className="form-container">
//         <input
//           type="text"
//           name="course"
//           placeholder="Course"
//           value={editing ? currentCourse.course : newCourse.course}
//           onChange={handleInputChange}
//         />
//         <select
//           name="program"
//           value={editing ? currentCourse.program : newCourse.program}
//           onChange={handleInputChange}
//         >
//           <option value="">-Select Program-</option>
//           {programs.map(program => (
//             <option key={program.ID} value={program.ProgramName}>{program.ProgramName}</option>
//           ))}
//         </select>
//         {editing ? (
//           <button onClick={updateCourse}>Update Course</button>
//         ) : (
//           <button onClick={addCourse}>Add Course</button>
//         )}
//       </div>
//       <ul className="courses-list">
//         {courses.map(course => (
//           <li key={course.ID}>
//             <span>{course.Course}</span>
//             <span>{course.ProgramName}</span>
//             <button onClick={() => editCourse(course)}>Edit</button>
//             <button onClick={() => deleteCourse(course.ID)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//       <div className="modal-footer">
//         <div className="button-container">
//           <button onClick={handleSave}>Save</button>
//           <button className="cancel" onClick={handleCancel}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Courses;

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './admin.css';

const Courses = ({ handleClose }) => {
  const [courses, setCourses] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [newCourse, setNewCourse] = useState({ course: '', professor: '', program: '' });
  const [editing, setEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState({ id: null, course: '', professor: '', program: '' });

  useEffect(() => {
    fetchCourses();
    fetchPrograms();
  }, []);

  const fetchCourses = useCallback(() => {
    axios.get('http://127.0.0.1:5000/admincourses')
      .then(response => {
        setCourses(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the courses!', error);
      });
  }, []);

  const fetchPrograms = useCallback(() => {
    axios.get('http://127.0.0.1:5000/adminprograms')
      .then(response => {
        setPrograms(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the programs!', error);
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (editing) {
      setCurrentCourse({ ...currentCourse, [name]: value });
    } else {
      setNewCourse({ ...newCourse, [name]: value });
    }
  };

  const addCourse = () => {
    axios.post('http://127.0.0.1:5000/admincourses', newCourse)
      .then(() => {
        fetchPrograms();
        fetchCourses();
        setNewCourse({ course: '', professor: '', program: '' });
      })
      .catch(error => {
        console.error('There was an error adding the course!', error);
      });
  };

  const updateCourse = () => {
    axios.put(`http://127.0.0.1:5000/admincourses/${currentCourse.id}`, currentCourse)
      .then(() => {
        fetchPrograms();
        fetchCourses();
        setEditing(false);
        setCurrentCourse({ id: null, course: '', professor: '', program: '' });
      })
      .catch(error => {
        console.error('There was an error updating the course!', error);
      });
  };

  const deleteCourse = (id) => {
    axios.delete(`http://127.0.0.1:5000/admincourses/${id}`)
      .then(() => {
        fetchCourses();
      })
      .catch(error => {
        console.error('There was an error deleting the course!', error);
      });
  };

  const handleSave = () => {
    if (editing) {
      updateCourse();
    } else if (newCourse.course && newCourse.program) {
      addCourse();
    }
    handleClose();
  };

  const editCourse = (course) => {
    setEditing(true);
    setCurrentCourse({ id: course.ID, course: course.Course, professor: course.Professor, program: course.ProgramName });
  };

  const handleCancel = () => {
    setEditing(false);
    setCurrentCourse({ id: null, course: '', professor: '', program: '' });
    handleClose();
  };

  return (
    <div className="courses-container">
      <h2>Manage Courses</h2>
      <div className="form-container">
        <input
          type="text"
          name="course"
          placeholder="Course"
          value={editing ? currentCourse.course : newCourse.course}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="professor"
          placeholder="Professor"
          value={editing ? currentCourse.professor : newCourse.professor}
          onChange={handleInputChange}
        />
        <select
          name="program"
          value={editing ? currentCourse.program : newCourse.program}
          onChange={handleInputChange}
        >
          <option value="">-Select Program-</option>
          {programs.map(program => (
            <option key={program.ID} value={program.ProgramName}>{program.ProgramName}</option>
          ))}
        </select>
        {editing ? (
          <button onClick={updateCourse}>Update Course</button>
        ) : (
          <button onClick={addCourse}>Add Course</button>
        )}
      </div>
      <ul className="courses-list">
        {courses.map(course => (
          <li key={course.ID}>
            <span>{course.Course}</span>
            <span>{course.Professor}</span>
            <span>{course.ProgramName}</span>
            <button onClick={() => editCourse(course)}>Edit</button>
            <button onClick={() => deleteCourse(course.ID)}>Delete</button>
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

export default Courses;
