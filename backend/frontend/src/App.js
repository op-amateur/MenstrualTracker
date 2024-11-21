import React, { useState} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/Signup';
import Login from './pages/Login';
//import axios from 'axios';
import Calendar from './pages/Calendar';
import Tracker from './pages/Tracker';

const App = () => {
    const [user, setUser] = useState(null);

    return (
        <Routes>
            <Route path="/signup" element={<SignUp setUser={setUser} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/calendar" element={user ? <Calendar user={user} /> : <Navigate to="/login" />} />
            <Route path="/tracker" element={user ? <Tracker user={user} /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to="/signup" />} />
        </Routes>
    );
};

export default App;