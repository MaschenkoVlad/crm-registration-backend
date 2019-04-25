const express = require('express');
const app = express();
const userRoutes = express.Router();

let User = require('../models/user')

userRoutes.route('/register').post((req, res) => {
    let newUser = new User(req.body);
    newUser.save()         
        .then( (newUser) => {
            res.status(200).json(newUser);
        })
        .catch( (err)=>{
            res.status(400).send('adding new user failed');
        })
})

userRoutes.route('/').get((req, res)=>{
    User.find((err, userList)=>{
        if(err){
            console.log(err);
        } else {
            res.json(userList)
        }
    })
})

module.exports = userRoutes;