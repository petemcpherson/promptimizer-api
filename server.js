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

    const createUserFromWebhook = async (email, fullName, plan) => {
        // const [firstName, lastName] = fullName.split(' ', 2);
        const nameParts = fullName.split(' ');
        const firstName = nameParts.shift();
        const lastName = nameParts.join(' ');
        console.log("Got first name:", firstName);
        console.log("Got last name:", lastName);

        let user;

        try {
            user = await User.signup(firstName, lastName, email, 'mRefL$d9NJs&5*TX@5Y', plan);

            console.log("User created successfully");
        } catch (error) {
            console.error("Error creating user:", error.message);
        }

        // Call sendRegistrationEmail after the user is created
        try {
            await sendRegistrationEmail(user);
        } catch (error) {
            console.log('Error sending registration email:', error.message);
        }
    };

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const customerEmail = session.customer_details.email;
            const customerName = session.customer_details.name;
            console.log("Got customer email: " + customerEmail);
            console.log("Got customer name:", customerName);


            try {
                await createUserFromWebhook(customerEmail, customerName, "trial");
            } catch (error) {
                console.error("Error creating user:", error.message);
            }

            // console.log("Got session: " + session);
            break;
        case 'customer.subscription.updated':
            const subscription = event.data.object;
            const customerId = subscription.customer;
            const previousAttributes = event.data.previous_attributes;

            try {
                const customer = await stripe.customers.retrieve(customerId);
                const customerEmail = customer.email;
                console.log("Got customer: " + customer);
                console.log("Got customer email: " + customerEmail);

                if (previousAttributes.status === 'trialing' && subscription.status === 'active') {
        
                    const user = await User.findOne({ email: customerEmail });
    
                    if (user) {
                        user.plan = 'pro';
                        await user.save();
                    } else {
                        console.log("Could not find user with email:", customerEmail);
                    }
                }
            } catch (error) {
                console.error("Error updating user:", error.message);
            }

           
           

           

            break;
        case 'customer.subscription.deleted':
            const deletedSubscription = event.data.object;
            const deletedCustomerId = deletedSubscription.customer;

            try {
                const deletedCustomer = await stripe.customers.retrieve(deletedCustomerId);
                const deletedCustomerEmail = deletedCustomer.email;
                console.log("Got deleted customer: " + deletedCustomer);
                console.log("Got deleted customer email: " + deletedCustomerEmail);

                const user = await User.findOne({ email: deletedCustomerEmail });
                console.log("Got user: " + user);

                if (user) {
                    user.plan = 'free';
                    await user.save();
                } else {
                    console.log("Could not find user with email:", deletedCustomerEmail);
                }
            } catch (error) {
                console.error("Error updating user:", error.message);
            }
            break;
        default:
        // console.log(`Unhandled event type ${event.type}`);
    }
    response.status(200).end();
});



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


