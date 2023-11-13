const express = require('express');
const mongoose = require('./config/db');
const env = require('dotenv').config()
const ejs = require('ejs');
const path = require('path');
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const session = require('express-session');
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const userRouter = require('./router/userRoutes');
const adminRouter = require('./router/adminRoutes');

app.use(express.static('public'));
app.use('/', userRouter);
app.use('/admin', adminRouter);

app.listen(3000, () => {
    console.log(`server start http://localhost:${port}`);
});
