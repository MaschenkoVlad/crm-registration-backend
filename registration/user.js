const express = require('express');
const router = express.Router();
const passport = require('passport');
// шифрование паролей
const bcrypt = require('bcryptjs')
// декодирование web-token
const jwt = require('jsonwebtoken')

const validateInput = require('../validation/register');
const validateLogin = require('../validation/login');
const User = require('../models/user');

router.post('/register', (req, res)=>{
  
    const { errors, isValid } = validateInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({
        email: req.body.email
    }).then( (user)=>{
        if (user) {
            return res.status(400).json({
                email: "email уже существует"
            });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                passpord: req.body.passpord,
            });
            bcrypt.genSalt(10, (err, salt) => {
                if(err) {
                    console.log('Error', err);
                } else {
                    bcrypt.hash(newUser.passpord, salt, (err, hash) => {
                        if(err) {
                            console.log('Error', err);
                        } else {
                            newUser.passpord = hash;
                            newUser.save().then( (user) => {
                                res.json(user)
                            })
                        }
                    })
                }
            })
        }
    })
});

router.post('/login', (req, res)=>{

    const { errors, isValid } = validateInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const passpord = req.body.passpord;

    User.findOne({email})
        .then( (user)=>{
            if(!user) {
                errors.email = 'User not found';
                return res.status(400).json(errors);
            } else {
                bcrypt.compare(passpord, user.passpord)
                    .then( (isMatch) => {
                        if(isMatch) {
                            const payload = {
                                name: user.name
                            }
                            jwt.sign(payload, 'secret', {expiresIn: 3600}, (err, token) =>{ 
                                if(err) {console.log(`Token error ${err}`)}
                                else {
                                    res.json({
                                        succes: true,
                                        token: `Bearer ${token}`
                                    })
                                }
                             })
                        } else {
                            errors.passpord = 'Incorrect Password';
                            return res.status(400).json(errors);
                        }
                    })
            }
        })
})

router.get('/me', passport.authenticate('jwt', {session: false}), (req, res)=>{
    return res.json({
        name: req.user.name,
        email: req.user.email
    });
});

module.exports = router;