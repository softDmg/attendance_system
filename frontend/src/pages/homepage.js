import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style.css';

export default function Homepage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin'); // Default role
  const navigate = useNavigate(); // Access the navigate function from useNavigate

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, role })
      });

      if (response.ok) {
        const responseData = await response.json();
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'student') {
          navigate('/student'); // Navigate to admin_index.html
        } else if (role === 'professor') {
          localStorage.setItem('loggedInProfessor', username);
          navigate('/professor'); // Navigate to professor page
        }
      } else {
        // Login failed
        alert('Login Failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Handle error gracefully
      alert('An error occurred during login.');
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    setRole(selectedRole); // Update role state with the selected role
  };

  return (
    <div className='container'>
      <form id='form' onSubmit={handleSubmit}>
        <div className='title'>
          <h1 id='title'>UPEC Attendance System</h1>
        </div>
        <h1>Login</h1>
        <div className='input-control'>
          <label htmlFor='username'>Username</label>
          <input
            type='text'
            name='username'
            id='username'
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div className='input-control'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            name='password'
            id='password'
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div className='profile-control'>
          <input
            type='radio'
            name='role'
            id='admin'
            value='admin'
            checked={role === 'admin'}
            onChange={handleRoleChange}
            required
          />
          <label htmlFor='admin'>Admin</label>

          <input
            type='radio'
            name='role'
            id='professor'
            value='professor'
            checked={role === 'professor'}
            onChange={handleRoleChange}
            required
          />
          <label htmlFor='professor'>Professor</label>

          <input
            type='radio'
            name='role'
            id='student'
            value='student'
            checked={role === 'student'}
            onChange={handleRoleChange}
            required
          />
          <label htmlFor='professor'>Student</label>
        </div>
        <div className='login'>
          <button type='submit' className='btn btn-primary'>
            Login
          </button>
        </div>
      </form>
    </div>
  );
}