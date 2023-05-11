const User = require('../models/userModel');

const checkWordLimit = async (req, res, next) => {
    const userId = req.user._id; // Retrieve userId from req.user object

    try {
        const user = await User.findById(userId);
        // console.log('checking limit', user.wordUsage.totalWords);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.wordUsage.totalWords > 10000 && user.plan === 'trial') {
            user.plan = 'limited';
            await user.save();
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = checkWordLimit;
