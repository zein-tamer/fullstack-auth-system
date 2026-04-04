const express = require('express');
const app = express();

require('./config/envCheck');

const PORT = process.env.PORT || 4000;

const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');

const path = require('path');
const  mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

connectDB();
// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to parse cookies
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use('/', require('./routes/root'));

app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/forgotPassword', require('./routes/forgotPassword'));
app.use('/resetPassword', require('./routes/resetPassword'));
app.use(verifyJWT);
app.use('/user', require('./routes/api/user'));

console.log(process.env.DATABASE_URI);

app.get(/^.*$/, (req, res) => {
  res.status(404);
  if(req.accepts('html')){
    res.sendFile(path.join(__dirname,'views', '404.html'));
  }else if (req.accepts('json')){
    res.json({ "error" : "page not found" });
  }else {
    res.type('txt').send("page not found")
  }
});

mongoose.connection.once('open',()=>{
    console.log('✅ MongoDB Connected Successfully')
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

})
