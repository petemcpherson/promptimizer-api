require('dotenv').config();
const brandsRouter = require('./routes/brands');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/posts');
const path = require('path');


// const { Router } = require('express');
const express = require('express');
const mongoose = require('mongoose');

// express app
const app = express();


// middleware
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
});

const cors = require('cors');
app.use(cors({
    origin: process.env.API_URL
}));



// routes
app.use('/api/brands', brandsRouter);
app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);

// serve static files from react frontend if in production
if (process.env.NODE_ENV === 'production') {
    // set static folder from the react frontend
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    // Handle any requests that don't match the ones above
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
}

// connect to mongodb
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}! hooray!`);
        })

    })
    .catch((err) => console.log(err));


