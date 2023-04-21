require('dotenv').config();
const fs = require('fs');
const dotenv = require('dotenv');
const brandsRouter = require('./routes/brands');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/posts');
const chatRoutes = require('./routes/chat');
const path = require('path');

if (fs.existsSync('.env.local')) {
    dotenv.config({ path: '.env.local' });
  } else {
    dotenv.config();
  }

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
const allowedOrigins = [
    "https://promptimizer-api.onrender.com",
    "http://localhost:3000",
];

// app.use(cors({
//     origin: function (origin, callback) {
//         if (process.env.NODE_ENV === "development" || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
// }));

app.use(cors());


app.all('*', (req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.path}`);
    next();
  });
  

// routes
app.use('/api/brands', brandsRouter);
app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chat', chatRoutes);


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


