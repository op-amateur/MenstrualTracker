const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const authController = require('./controller/authController');
const dotenv = require('dotenv').config();

const app = express();

connectDB();

var store = new MongoDBStore(
  {
    uri: process.env.MONGO_URL,
    collection: 'mySessions'
  });
app.use(cors(
  {
    origin:["https://menstrualtracker.onrender.com", "http://localhost:3000"],
    
    credentials: true 
  }));
app.use(express.json());
app.use(bodyParser.json());

app.use(session({
    secret: process.env.secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', 
        httpOnly: true,
        sameSite: 'Lax',
        maxAge: 1000 * 60 * 60 * 0.25 
    },
    store: store
}));



// Define Routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
