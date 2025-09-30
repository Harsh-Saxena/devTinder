const express = require('express');

const app = express();
const {adminAuth} = require('./middlewares/auth');

//order of routes matter
// app.use("/",(req,res) => {
//     res.send('Hello harsh');
// });

// app.use("/test",(req,res,next) => {
//     //res.send('Hello server');
//     next();
// });


app.use("/admin",adminAuth);


app.get(
    "/admin/getData",
    (req,res,next) => {
        console.log('get request');
    res.send('Hello admin');
    }   
)

app.get(
    "/user",
    (req,res,next) => {
        console.log('get request');
    res.send({firstName : 'harsh', lastName : 'saxena'});
    }

);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});