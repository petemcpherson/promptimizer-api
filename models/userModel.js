const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validate = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
});

// static model for User

userSchema.statics.signup = async function (firstName, lastName, email, password) {

    // validators

    if (!firstName || !lastName || !email || !password) {
        throw Error('All fields are required');
    }

    if (!validate.isEmail(email)) {
        throw Error('Invalid email');
    }

    if (!validate.isStrongPassword(password)) {
        throw Error('Password isn\'t strong enough');
    }

    const exists = await this.findOne({ email });

    if (exists) {
        throw Error('Email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ firstName, lastName, email, password: hash });

    return user;
}


// static login model for user

userSchema.statics.login = async function (email, password) {

    if (!email || !password) {
        throw Error('All fields are required');
    }

    const user = await this.findOne({ email });

    if (!user) {
        throw Error('Invalid email.');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw Error('Invalid password.');
    }

    return user;
    // instance method for resetting password
    userSchema.methods.resetPassword = async function (password) {
        this.password = await bcrypt.hash(password, 12);
        await this.save();
    }

}





module.exports = mongoose.model('User', userSchema);
