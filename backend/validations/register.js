const Validator = require('validator');
const isEmpty = require('./isEmpty');
module.exports = function validateRegisterInput(data){
    let errors = {};
    data.username = !isEmpty(data.username) ? data.username : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : '';
    if(!Validator.isLength(data.username, {min: 2, max: 30})){
        errors.username = 'Username must be between 2 and 30 characters';
    }
    if(Validator.isEmpty(data.username)){
        errors.username = 'Username is required';
    }
    if(!Validator.isEmail(data.email)){
        errors.email = 'Email is invalid';
    }
    if(Validator.isEmpty(data.email)){
        errors.email = 'Email is required';
    }
    if(Validator.isEmpty(data.password)){
        errors.password = 'Password is required';
    }
    if(!Validator.isLength(data.password, {min: 6, max: 30})){
        errors.password = 'Password must be between 6 and 30 characters';
    }
    if(Validator.isEmpty(data.confirmPassword)){
        errors.confirmPassword = 'Confirm password is required';
    }
    if(!Validator.equals(data.password, data.confirmPassword)){
        errors.confirmPassword = 'Password must match';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}