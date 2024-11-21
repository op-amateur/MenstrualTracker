const User = require('../models/User'); // Assuming the User model is set up
const bcrypt = require('bcryptjs');
const session = require('express-session');

const signup = async (req, res) => {
    const { email, password, height, weight, periodDate } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        user = new User({
            email,
            password: hashedPassword,
            height,
            weight,
            periodDates: [new Date(periodDate)]
        });

        await user.save();

        res.status(201).json({ message: 'User signuped successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials'});
        }

        // If password matches, create a session
        req.session.user = {
            id: user._id,
            email: user.email,
            height: user.height,
            weight: user.weight,
            periodDates: user.periodDates
        };
        await req.session.save();
        console.log('User logged in:', req.session.user);
        // Send success response
        return res.status(200).json({
            message: 'Login successful',
            user: req.session.user
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};


const logout = async(req,res)=>{
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }

        res.clearCookie('connect.sid', {
            path: '/',
            httpOnly: true,
            sameSite: 'Lax',
            secure: false
        });

        return res.status(200).json({ message: 'Logout successful' });
    });
};

module.exports = {
    signup,
    login,
    logout
};