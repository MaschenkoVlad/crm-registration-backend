//JSON Web Token (JWT)
//модуль позволяет аутентифицировать endpoints
//с помощью веб-токена JSON. Он предназначен для защиты endpoints RESTful без сеансов.
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');

//opts - содержащий опции для управления тем, как токен извлекается из запроса или проверяется.
const opts = {};

//принимает запрос в качестве единственного параметра и возвращает JWT в виде строки или ноль.
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';

//jwt_payload - литерал объекта, содержащий декодированную JWT payload.
module.exports = ( passport ) => {
    passport.use(new JWTStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
            .then( (user)=>{
                if (user){
                    return done(null, user)
                }
                return done(null, fasle)
            })
            .catch( (err)=> console.error(err) );
    }));
}
