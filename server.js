require('dotenv').config();
const fs = require('fs');
const dotenv = require('dotenv');
const brandsRouter = require('./routes/brands');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/posts');
const chatRoutes = require('./routes/chat');
const promptRoutes = require('./routes/prompts');
const path = require('path');
const cron = require('node-cron');
const { resetAllUsersTokenUsage, sendRegistrationEmail } = require('./controllers/userController');

// new stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_SIGNING_SECRET;
const User = require('./models/userModel');

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

const bodyParser = require('body-parser');

// STRIPE STUFF


app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (request, response) => {
    const payload = request.body;
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
        // console.log("got payload & event" + event)
    } catch (err) {
        // console.log(err);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const customerEmail = session.customer_details.email;
            console.log("Got customer email: " + customerEmail);

            try {
                await sendRegistrationEmail(customerEmail);
                console.log("Registration email sent to:", customerEmail);
            } catch (error) {
                console.error("Error sending registration email:", error.message);
            }


            // console.log("Got session: " + session);
            break;
        default:
            // console.log(`Unhandled event type ${event.type}`);
    }
    response.status(200).end();
});

// FOR TESTING

// app.post('/test-webhook', bodyParser.json(), async (req, res) => {
//     const customerEmail = req.body.email;

//     try {
//         await sendRegistrationEmail(customerEmail);
//         console.log("Registration email sent to:", customerEmail);
//         res.status(200).json({ message: "Registration email sent" });
//     } catch (error) {
//         console.error("Error sending registration email:", error.message);
//         res.status(400).json({ error: error.message });
//     }
// });



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
app.use('/api/prompts', promptRoutes);


// serve static files from react frontend if in production
if (process.env.NODE_ENV === 'production') {
    // set static folder from the react frontend
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    // Handle any requests that don't match the ones above
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
}

// crons

// Schedule a task to run at 02:00 on the first day of every month
cron.schedule('0 2 1 * *', async () => {
    console.log('Resetting all users token usage');
    await resetAllUsersTokenUsage();
});


// connect to mongodb
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}! hooray!`);
        })

    })
    .catch((err) => console.log(err));


