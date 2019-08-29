const express = require('express');
const next = require('next');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const StudentsRouter = require('./routes/students');
const AuthRouter = require('./routes/auth');
const ProjectsRouter = require('./routes/projects');
const morgan = require('morgan');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const path = require('path');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
    .then(()=>{
        dotenv.config();
        const server = express();

        //MongoDB Connection
        mongoose.connect(process.env.MONGO_URI)
            .then(()=>{
                console.log('Connected to database');
            })
            .catch(err => {
                console.log("Error: ", err.message);
            });


        //Middlewares

        server.use(morgan('dev'));
        server.use(express.json());
        server.use(cookieParser());
        server.use(expressValidator());
        //Routes
        server.use('/api/students',StudentsRouter);
        server.use('/api/auth',AuthRouter);
        server.use('/api/projects',ProjectsRouter);
        //Unauthorized Handler
        server.use(function (err,req,res,next) {
            if (err.name === 'UnauthorizedError'){
                res.status(401).json({error:"You are not Authorized to perform this Action"})
            }
        });
        server.get('/pdf/:fileName',(req,res)=>{
           const file = path.join(__dirname,'..','static',req.path)
            // console.log(path.join(__dirname,'..',''))
            app.serveStatic(req,res,file)
        });
        server.get('/presentation/:fileName',(req,res)=>{
            const file = path.join(__dirname,'..','static',req.path)
            // console.log(path.join(__dirname,'..',''))
            app.serveStatic(req,res,file)
        })
        server.get('/',(req, res)=>{
            return app.render(req, res, '/',req.query)
        });
        server.get('/sign-in',(req,res)=>{
            return app.render(req, res, '/sign-in',req.query)
        });
        server.get('/student/sign-up',(req,res)=>{
            return app.render(req, res, '/student/sign-up',req.query)
        });
        server.get('/student/overview',(req,res)=>{
            return app.render(req, res, '/student/overview',req.query)
        });
        // server.get('/student/verify-email/:id',(req,res)=>{
        //     return app.render(req, res, '/student/verify-email',{id:req.params.id})
        // });
        server.get('/student/project/create',(req,res)=>{
            return app.render(req, res, '/student/project/create',req.query)
        });
        server.get('/student/project/backlogs',(req,res)=>{
            return app.render(req, res, '/student/project/backlogs',req.query)
        });
        server.get('/student/project/vision-document',(req,res)=>{
            return app.render(req, res, '/student/project/vision-document',req.query)
        });
        server.get('/student/project/vision-document/new',(req,res)=>{
            return app.render(req, res, '/student/project/vision-document/new',req.query)
        });
        server.get('*', (req, res) => {
            return handle(req, res)
        });

        server.listen(process.env.PORT, ()=>{
            console.log(`Server Running on PORT: ${process.env.PORT}`)
        });
    })
    .catch((ex) => {
        console.error(ex.stack);
        process.exit(1)
    });


