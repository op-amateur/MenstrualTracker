const session = require('express-session');

exports.isAuthenticated = (req, res, next) => {
    console.log('Session:', req.session.user);
    try{
        if (req.session.user) {
            return next();
        } else {
            return res.status(401).json({ message: 'authMiddleware error' });
        }
    }catch(err)
    {
        console.log(err);
    }
};