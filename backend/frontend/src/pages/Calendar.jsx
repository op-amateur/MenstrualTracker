import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/styles.css'


const Calendar = ({ user }) => {
    const [periodDate, setPeriodDate] = useState('');
    const [height, setHeight] = useState(user.height || '');
    const [weight, setWeight] = useState(user.weight || '');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.periodDates && user.periodDates.length > 0) {
            const lastPeriodDate = user.periodDates[user.periodDates.length - 1]; 
            setPeriodDate(new Date(lastPeriodDate).toISOString().substring(0, 10)); 
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Update period and BMI
            const res=await axios.put('http://localhost:5000/api/users/calendar', { 
                periodDate,
                height,
                weight 
            }, { withCredentials: true });
            if (res.status===200) {
                navigate('/tracker');
            } else {
                navigate('/login');
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Error submitting data'); 
            } else {
                setError('An unexpected error occurred.'); 
            }
        }
    };

    const skipToTracker = async () => {
        navigate('/tracker');
    };

    return (
        <div>
            <h2>Enter Your Latest Details</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Period Date:</label>
                    <input 
                        type="date" 
                        value={periodDate} 
                        onChange={(e) => setPeriodDate(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Height (cm):</label>
                    <input 
                        type="number" 
                        value={height} 
                        onChange={(e) => setHeight(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Weight (kg):</label>
                    <input 
                        type="number" 
                        value={weight} 
                        onChange={(e) => setWeight(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            <button onClick={skipToTracker}>Skip to Tracker</button>
        </div>
    );
};

export default Calendar;
