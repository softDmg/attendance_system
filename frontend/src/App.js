import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/homepage';
import ProfessorPage from './pages/professorpage';
import './App.css';
import Admin from './pages/admin';
import Report from './pages/report';
import Student from './pages/student';
// import FaceRecognition from './FaceRecognition';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Homepage />} />
        <Route path='/professor' element={<ProfessorPage />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/report' element={<Report />} />
        <Route path='/student' element={<Student />} />
        
      </Routes>
    </Router>
  );
}

export default App;
