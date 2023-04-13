require('dotenv').config();
const brandsRouter = require('./routes/brands');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/posts');

// const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '..', '.env') });


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

// routes
app.use('/api/brands', brandsRouter);
app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);

// connect to mongodb
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}! hooray!`);
        })

    })
    .catch((err) => console.log(err));


