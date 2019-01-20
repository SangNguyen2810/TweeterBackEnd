const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors')
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');


const app = express();

app.use(bodyParser.urlencoded({extended: false})); 
app.use(bodyParser.json());
app.use(cors());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


const db = require('./config/key').mongoURI;

mongoose
    .connect(db,{ useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


app.use(passport.initialize());

require('./config/passport')(passport)

app.get('/', (req,res) => res.send('Hello'));

app.use('/api/users',users);
app.use('/api/posts', posts);
 
const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`Server running on port ${port}`));