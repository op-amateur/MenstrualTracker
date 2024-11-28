import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/styles.css'

const api = `${process.env.BACKEND_URL}/api/users/login`;

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(api, {
                email,
                password
            },{ withCredentials: true });

            if (res.status === 200) {
                // Set user data after successful login
                setUser(res.data.user); // Assuming res.data contains user details
                navigate('/calendar');
            }
        } catch (err) {
            // Check if the error has a response and if it contains data
            if (err.response && err.response.data) {
                setError(err.response.data.message'); // Accessing the message property
            } else {
                setError('An error occurred. Please try again.'); // Fallback error message
            }
        }
    };

    const skipToSignup = async () => {
        navigate('/signup');
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                />
                
                <label>Password:</label>
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                />
                
                <button type="submit">Login</button>
            </form>
            <button onClick={skipToSignup}>Sign Up</button>
        </div>
    );
};

export default Login;
