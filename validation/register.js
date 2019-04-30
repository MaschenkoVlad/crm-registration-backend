const Validator = require('validator')
const isEmpty = require('./validation')

validateRegister = (data) => {
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.passwordConfirm = !isEmpty(data.passwordConfirm) ? data.passwordConfirm : '';

    if(Validator.isEmpty(data.name)){
        errors.name = 'Name is required';
    }
    if(!Validator.isEmail(data.email)){
        errors.email = 'Emails is invalid';
    }
    if(Validator.isEmpty(data.email)){
        errors.email = 'Emails is required';
    }
    if(Validator.isEmpty(data.password)){
        errors.password = 'Password is required';
    }
    if(Validator.isEmpty(data.passwordConfirm )){
        errors.passwordConfirm  = 'Password is required';
    }
    if(!Validator.equals(data.password, data.passwordConfirm)){
        errors.passwordConfirm  = 'Password and Confirm Password must be match';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}    

module.exports = validateRegister;