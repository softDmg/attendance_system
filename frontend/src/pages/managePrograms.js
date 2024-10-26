import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './admin.css';

const Programs = ({ handleClose }) => {
    const [programs, setPrograms] = useState([]);
    const [newProgram, setNewProgram] = useState('');
    const [editing, setEditing] = useState(false); // For toggling between add and edit mode
    const [currentProgram, setCurrentProgram] = useState({ id: null, name: '' }); // For storing the program being edited

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = () => {
        axios.get('http://127.0.0.1:5000/adminprograms')
            .then(response => {
                setPrograms(response.data);
            })
            .catch(error => {
                console.error('Error fetching programs:', error);
            });
    };

    const addProgram = () => {
        axios.post('http://127.0.0.1:5000/adminprograms', { program_name: newProgram })
            .then(() => {
                fetchPrograms();
                setNewProgram(''); // Clear the input after adding
            })
            .catch(error => {
                console.error('Error adding program:', error);
            });
    };

    const updateProgram = (id, programName) => {
        axios.put(`http://127.0.0.1:5000/adminprograms/${id}`, { program_name: programName })
            .then(() => {
                fetchPrograms();
                setEditing(false); // Exit editing mode
                setCurrentProgram({ id: null, name: '' }); // Clear current program
            })
            .catch(error => {
                console.error('Error updating program:', error);
            });
    };

    const deleteProgram = (id) => {
        axios.delete(`http://127.0.0.1:5000/adminprograms/${id}`)
            .then(() => {
                fetchPrograms();
            })
            .catch(error => {
                console.error('Error deleting program:', error);
            });
    };

    const handleSave = () => {
        if (editing) {
            // If in editing mode, update the program
            updateProgram(currentProgram.id, newProgram);
        } else {
            // Otherwise, add a new program
            addProgram();
        }
    };

    const handleEdit = (program) => {
        setEditing(true); // Enter editing mode
        setCurrentProgram({ id: program.ID, name: program.ProgramName }); // Set the program being edited
        setNewProgram(program.ProgramName); // Show the program name in the input field
    };

    const handleCancel = () => {
        setEditing(false); // Exit editing mode
        setCurrentProgram({ id: null, name: '' }); // Clear the current program
        setNewProgram(''); // Clear input field
        handleClose(); // Close the modal
    };

    return (
        <div className="programs-container">
            <h2>Manage Programs</h2>
            <div className="form-container">
                <input
                    type="text"
                    name="program"
                    placeholder="Program Name"
                    value={newProgram}
                    onChange={(e) => setNewProgram(e.target.value)}
                />
                <button onClick={handleSave}>{editing ? 'Update Program' : 'Add Program'}</button>
            </div>
            <ul className="programs-list">
                {programs.map(program => (
                    <li key={program.ID}>
                        <span>{program.ProgramName}</span>
                        <button onClick={() => handleEdit(program)}>Edit</button>
                        <button onClick={() => deleteProgram(program.ID)}>Delete</button>
                    </li>
                ))}
            </ul>
            <div className="modal-footer">
                <div className="button-container">
                    {/* <button onClick={handleSave}>{editing ? 'Save Changes' : 'Save'}</button> */}
                    <button className="cancel" onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default Programs;
