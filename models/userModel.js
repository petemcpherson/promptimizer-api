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
    tokenUsage: {
        totalTokens: {
            type: Number,
            default: 0
        },
        resetDate: {
            type: Date,
            default: Date.now
        }
    }
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
}

// instance method for resetting password
userSchema.methods.resetPassword = async function (newPassword) {
    this.password = await bcrypt.hash(newPassword, 12);
    await this.save();
}

userSchema.methods.updateTokenUsage = async function (tokens) {
    const today = new Date();
    const resetDate = new Date(this.tokenUsage.resetDate);

    if ((today.getMonth() !== resetDate.getMonth() || today.getFullYear() !== resetDate.getFullYear()) && today.getDate() === 1) {
        // Reset the token usage if the current month and year are different from the reset date
        // and it is the first day of the month
        this.tokenUsage.totalTokens = tokens;
        this.tokenUsage.resetDate = today;
    } else {
        // Otherwise, just update the total tokens
        this.tokenUsage.totalTokens += tokens;
    }

    await this.save();
};




module.exports = mongoose.model('User', userSchema);
