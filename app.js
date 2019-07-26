const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const StudentsRouter = require('./routes/api/students');
const AuthRouter = require('./routes/api/auth');
dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('Connected to database');
    })
    .catch(err => {
        console.log("Error: ", err.message);
    });

app.use(express.json());

app.use('/api/students',StudentsRouter);
app.use('/api/auth',AuthRouter);

app.listen(process.env.PORT, ()=>{
    console.log(`Server Running on PORT: ${process.env.PORT}`)
});

