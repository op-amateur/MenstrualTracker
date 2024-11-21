import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/styles.css'

const api = `${process.env.REACT_APP_BACKEND_URL}/api/users/signup`;

const SignUp = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [periodDate, setPeriodDate] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(api, {
                email,
                password,
                height,
                weight,
                periodDate
            },{ withCredentials: true });

            if (res.status === 201) {
                // Set user data
                setUser(res.data.user); // Assuming res.data contains user details
                // Redirect to calendar page after successful signup
                navigate('/calendar');
            }
        } catch (err) {
            setError(err.response?.data?.message);
        }
    };

    const skipToLogin = async () => {
        navigate('/login');
    };

    return (
        <div>
            <h2>Sign Up</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required />

                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />

                <label>Height (cm):</label>
                <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    required />

                <label>Weight (kg):</label>
                <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required />

                <label>Last Period Date:</label>
                <input
                    type="date"
                    value={periodDate}
                    onChange={(e) => setPeriodDate(e.target.value)}
                    required />

                <button type="submit">Sign Up</button>
            </form>
            
        </div>
    );
};

export default SignUp;