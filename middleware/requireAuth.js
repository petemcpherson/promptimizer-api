const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


const requireAuth = async (req, res, next) => {

    // verify authentication

    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'You must be logged in' });
    }

    const token = authorization.split(' ')[1];

    try {
        const {_id} = jwt.verify(token, process.env.SECRET);

        //old code
        // req.user = await User.findOne({_id}).select('_id');

        req.user = await User.findOne({ _id });


        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'Requres is not authorized.' });
    }


}

module.exports = requireAuth;