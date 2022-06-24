const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { SECRET } = require('../config/env')

exports.create = (userData) => User.create(userData);

exports.login = async (email, password) => {
    const user = await User.findOne({email})

    if (!user) {
        throw { message: 'Cannot find email or password'};
    }

    const isValid = await bcrypt.compare(password, user.password);

    if(!isValid){
        throw { message: 'Cannot find email or password'};
    };

    return user;
};


exports.createUserToken = async (user) => {
    const payload = {_id: user._id, email: user.email, address: user.address};

    const options = {expiresIn: '2d'};

    const tokenPromise = new Promise((resolve, reject) => {

        jwt.sign(payload, SECRET, options, (err, decodedToken) =>{
            if(err){
                return reject(err);
            }
            resolve(decodedToken);
        });
    });

    return tokenPromise;
};
