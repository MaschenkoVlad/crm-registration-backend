const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
},{
    collection: 'userList'
});

UserSchema.methods.generateHash = ( password ) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

UserSchema.methods.comparePassword = function(password, callback) {
    return callback(null, bcrypt.compareSync(password, this.password));
};

let User = mongoose.model('User', UserSchema);

module.exports = User;
