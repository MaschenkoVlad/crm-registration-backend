const Validator = require('validator')
const isEmpty = require('./validation')

validateInput = (data) => {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if(Validator.isEmpty(data.email)){
        errors.email = 'Emails is required';
    }
    if(Validator.isEmpty(data.password)){
        errors.password = 'Password is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}    

module.exports = validateInput;