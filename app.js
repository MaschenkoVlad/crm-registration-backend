const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./db');
const cors = require('cors');
const app = express();
const userRoutes = express.Router();
const PORT = process.env.PORT || 5000;

let User = require('./models/user')
let UserSession = require('./models/userSession');

const validateLogin = require('./validation/login');
const validateRegister = require('./validation/register');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(config.DB, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection...')
});

//get data
userRoutes.route('/').get((req, res) => {
    console.log('Get data: ', req)
    User.find({}, (err, userList) => {
        if(err){
            console.log(err);
        } else {
            res.json(userList)
        }
    });
});

//sign up
userRoutes.route('/register').post((req, res) => {
    console.log('Register: ', req.body)

    const { errors, isValid } = validateRegister(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
        .then((user) => {
            console.log( 'Server: has user-', user, ' req.body ',  req.body.name, req.body.email, req.body.password,)
            if (user) {
                return res.status(400).json({
                    email: "account already exists"
                });
            } 
            else {
                const newUser = new User();
                newUser.name = req.body.name;
                newUser.email = req.body.email;
                newUser.password = newUser.generateHash(req.body.password),
                
                console.log( 'New User: ', newUser, newUser.name, newUser.email, newUser.password );
                newUser.save((err, newUser) => {
                    if (err) {
                        console.log('error saving to user: ', err)
                        return res.json(err)
                    } else {
                        res.json(newUser);
                    }
                });
            }
        })
});

//sign in
userRoutes.route('/login').post((req, res) => {
    console.log('Login: ', req.body)

    const { errors, isValid } = validateLogin(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }

    const email = req.body.email;
    const password = req.body.password;
    console.log(email, password)

    User.findOne( {email} )
        .then( ( user ) => {
            console.log( user );
            if( !user ) {
                return res.status(400).json({
                    email: 'User not found'
                });
            }
            user.comparePassword(password, (error, match) => {
                if(!match) {
                    return res.status(400).json({
                        password: 'Incorrect Password'
                    });
                } else {
                    console.log('Correct Password')
                }
            });
            const newUserSession = new UserSession({
                userId: user._id
            })
            console.log(newUserSession);
            newUserSession.save((err, newUserSession) => {
                if (err) {
                    console.log('error login user: ', err)
                    return res.json(err)
                } else {
                    res.json(newUserSession);
                }
            });
        });
});

app.use('/auth', userRoutes);

app.listen(PORT, () => {
    console.log(`Server up and running on PORT: ${PORT}`);
});