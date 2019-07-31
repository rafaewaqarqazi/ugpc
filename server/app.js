const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const StudentsRouter = require('./routes/students');
const AuthRouter = require('./routes/auth');
const ProjectsRouter = require('./routes/projects');
const morgan = require('morgan');
const expressValidator = require('express-validator');
dotenv.config();

const app = express();

//MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('Connected to database');
    })
    .catch(err => {
        console.log("Error: ", err.message);
    });


//Middlewares

app.use(morgan('dev'));
app.use(express.json());
app.use(expressValidator());
//Routes
app.use('/api/students',StudentsRouter);
app.use('/api/auth',AuthRouter);
app.use('/api/projects',ProjectsRouter);
//Unauthorized Handler
app.use(function (err,req,res,next) {
    if (err.name === 'UnauthorizedError'){
        res.status(401).json({error:"You are not Authorized to perform this Action"})
    }
});


app.listen(process.env.PORT, ()=>{
    console.log(`Server Running on PORT: ${process.env.PORT}`)
});

