import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/css/styles.css';

const api = `${process.env.BACKEND_URL}/api/users/tracker`;
const api2=`${process.env.BACKEND_URL}/api/users/logout`;

const Tracker = ({ user }) => {
    const [lastPeriod, setLastPeriod] = useState('');
    const [cycleLength, setCycleLength] = useState(0);
    const [bmi, setBMI] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrackerData = async () => {
            try {
                const res = await axios.get(api, { withCredentials: true });
                setCycleLength(res.data.cycleLength);
                setBMI(res.data.bmi);
                setLastPeriod(new Date(res.data.lastPeriod));
                setLoading(false);
            } catch (err) {
                setLoading(false);
                if (err.response && err.response.data) {
                    console.error(err.message);
                    setError(err.response.data.message);
                } else {
                    setError('An unexpected error occurred.');
                }
            }
        };

        if (user) {
            fetchTrackerData();
        } else {
            setLoading(false);
        }
    }, [user]);

    const checkHealth = () => {
        let responseString = '';
        if (bmi < 18.5 || bmi > 24.9) {
            responseString += 'You may need to investigate your BMI. The ideal BMI range for adults is 18.5 - 24.9.';
        }
        if (cycleLength > 35 || cycleLength < 21) {
            responseString += ' You need to investigate your menstrual cycle period. The typical cycle is between 21 and 35 days.';
        }
        return responseString===''?'You are in a healthy range.':responseString;
    };

    const finalResponseString = checkHealth();

    const checkPhase = (finalResponseString) => {
        let phase = '';
        let details = '';
        if (finalResponseString === 'You are in a healthy range.') 
        {
            const today = new Date();
            const dayOfCycle = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24));

            const menstruationEnd = Math.ceil(0.2 * cycleLength);
            const ovulationDay = Math.ceil(0.5 * cycleLength);
            const lutealStart = ovulationDay + 1;

            if (dayOfCycle >= 1 && dayOfCycle <= menstruationEnd) {
                phase = 'Menstruation';
                details = `This is the menstruation phase, lasting the first ${menstruationEnd} days.`;
            } else if (dayOfCycle > menstruationEnd && dayOfCycle < ovulationDay) {
                phase = 'Follicular';
                details = 'This is the follicular phase, where the body prepares an egg for release.';
            } else if (dayOfCycle === ovulationDay) {
                phase = 'Ovulation';
                details = 'This is the ovulation phase, around the midpoint of your cycle.';
            } else if (dayOfCycle >= lutealStart && dayOfCycle <= cycleLength) {
                phase = 'Luteal';
                details = 'This is the luteal phase, where progesterone levels increase to prepare for potential pregnancy.';
            }
        }

        return { phase, details };
    };

    const handleLogout = async () => {
        try {
            await axios.get(api2, { withCredentials: true });
            navigate('/login');
        } catch (err) {
            console.error('Error logging out:', err.response.data.message);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }
    const { phase, details } = checkPhase(finalResponseString);
    const daysSinceLastPeriod = Math.floor((new Date() - lastPeriod) / (1000 * 60 * 60 * 24));

    return (
        <div>
            <h2>Personalized Tracker</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>Last Period Date: {lastPeriod.toISOString().substring(0, 10)}</p>
            <p>Days between last two periods: {cycleLength}</p>
            <p>BMI: {bmi}</p>
            <p>{finalResponseString}</p>
            <p>Days since last period: {daysSinceLastPeriod}</p>
            <p>Current Phase: {phase===''?'Please investigate your menstrual health further':phase}</p>
            <p>Details: {details===''?'Consult a gynecologist for guidance on your BMI or cycle duration.':details}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Tracker;
