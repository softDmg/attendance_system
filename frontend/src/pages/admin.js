import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './modal';
import Professors from './Professors';
import Courses from './courses';
import ManagePrograms from './managePrograms';
import ManageStudents from './manageStudents';
import './admin.css';


const Admin = () => {
    const [showProfessorsModal, setShowProfessorsModal] = useState(false);
    const [showCoursesModal, setShowCoursesModal] = useState(false);
    const [showProgramsModal, setShowProgramsModal] = useState(false);
    const [showManageStudentsModal, setShowManageStudentsModal] = useState(false);

    const navigate = useNavigate();

    const handleProfessorsModal = () => {
        setShowProfessorsModal(!showProfessorsModal);
    };

    const handleCoursesModal = () => {
        setShowCoursesModal(!showCoursesModal);
    };

    const handleProgramsModal = () => {
        setShowProgramsModal(!showProgramsModal);
    };

    const handleManageStudentsModal = () => {
        setShowManageStudentsModal(!showManageStudentsModal);
    };

  
    const handleLogout = () => {
        localStorage.removeItem('loggedInProfessor');
        navigate('/');
    };

    return (
        <div>
            <button className="adminlogout" onClick={handleLogout}>Logout</button>
            <div className="admin-container">
                <h1 className="title">Admin Dashboard</h1>
                <div className="admin-buttons">
                    <button onClick={handleProfessorsModal}>Manage Professors</button>
                    <button onClick={handleCoursesModal}>Manage Courses</button>
                    <button onClick={handleProgramsModal}>Manage Programs</button>
                    <button onClick={handleManageStudentsModal}>Manage Students</button>
                    
                </div>

                <Modal show={showProfessorsModal} handleClose={handleProfessorsModal}>
                    <Professors handleClose={handleProfessorsModal} />
                </Modal>

                <Modal show={showCoursesModal} handleClose={handleCoursesModal}>
                    <Courses handleClose={handleCoursesModal} />
                </Modal>

                <Modal show={showProgramsModal} handleClose={handleProgramsModal}>
                    <ManagePrograms handleClose={handleProgramsModal} />
                </Modal>

                <Modal show={showManageStudentsModal} handleClose={handleManageStudentsModal}>
                    <ManageStudents handleClose={handleManageStudentsModal} />
                </Modal>
            </div>
        </div>
    );
};

export default Admin;
