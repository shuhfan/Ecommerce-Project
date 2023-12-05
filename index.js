const express = require('express');
const mongoose = require('./config/db');
const env = require('dotenv').config()
const ejs = require('ejs');
const path = require('path');
const userRouter = require('./router/userRoutes');
const adminRouter = require('./router/adminRoutes');
const cartRouter = require('./router/cartRoutes')
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.use(express.static('public'));
app.use('/', userRouter);
app.use('/admin', adminRouter);
app.use('/cart',cartRouter)

app.listen(3000, () => {
    console.log(`server start http://localhost:${port}`);
});
