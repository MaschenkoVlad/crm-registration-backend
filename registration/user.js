const express = require('express');
const router = express.Router();
const passport = require('passport');
// шифрование паролей
const bcrypt = require('bcryptjs')
// декодирование web-token
const jwt = require('jsonwebtoken')

const validateInput = require('./register');
const User = require('../models/user');

router.post('/register', (req, res)=>{
  
    const { errors, isValid } = validateInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const newUser = new User({
        email: req.body.email,
        password: req.body.passpord
    });

    bcrypt.genSalt(10, (err, salt) => {
        if(err) {
            console.log('Error', err);
        } else {
            // salt - соль
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
})

module.exports = router;