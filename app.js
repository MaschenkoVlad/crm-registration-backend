const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./db');
const cors = require('cors');
const app = express();
const userRoutes = express.Router();
const PORT = process.env.PORT || 5000;

let User = require('./models/user')

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(config.DB, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection...')
});

userRoutes.route('/').get((req, res) => {
    User.find({}, (err, userList) => {
        if(err){
            console.log(err);
        } else {
            res.json(userList)
        }
    })
})

userRoutes.route('/register').post((req, res) => {
    let newUser = new User(req.body);
    newUser.save()         
        .then( (newUser) => {
            res.status(200).json(newUser);
        })
        .catch( (err) => {
            res.status(400).send('adding new user failed');
        })
})

userRoutes.route('/login').post((req, res) => {
    console.log(req.body)
    let newUser = new User(req.body);
    console.log(newUser)
    newUser.save()         
        .then( (newUser) => {
            res.status(200).json(newUser);
        })
        .catch( (err) => {
            res.status(400).send('adding new user failed');
        })
})

app.use('/auth', userRoutes)

app.listen(PORT, () => {
    console.log(`Server up and running on PORT: ${PORT}`);
});


