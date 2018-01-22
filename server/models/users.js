const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        token: {
            require: true,
            type: String
        },
        access: {
            require: true,
            type: String
        }
    }]
}, { usePushEach: true });

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, 'mine').toString();
    user.tokens.push({ access, token });

    return user.save().then(() => {
        return token;
    });
};

UserSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    }
    else {
        next();
    }
});

UserSchema.statics.findByToken = function (token) {
    var user = this;
    var decoded;
    try {
        decoded = jwt.verify(token, 'mine');
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;
    return User.findOne({ email }).then((user) => {
        if (!user)
            return Promise.reject();
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (er, hs) => {
                if (hs)
                    return resolve(user);
                else
                    return reject();
            })
        });
    });
};

var User = mongoose.model('User', UserSchema);

module.exports = { User };