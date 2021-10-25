console.log("Hello Student Developer");


// ------------------------All files ---------------------------------

const express = require('express');
const loginRoute = require('./Express Routers/Auth');

const tests= require('./Express Routers/createTest');
const transactions = require('./Express Routers/Transaction');
// const bcrypt = require('brcypt');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
const YAML = require('yamljs');
var path = require('path');

const Admin = require('./Express Routers/AdminRoles');
const checkout= require('./Express Routers/Checkout');

const swaggerUI = require('swagger-ui-express');

const swaggerJsDocs= YAML.load('./api.yaml');

const customerContact = require('./Express Routers/customerContact');

const category = require('./Express Routers/Category');
const bankCrud = require('./Express Routers/BankCrud');
const profile = require('./Express Routers/profile');
const otpapi = require('./Express Routers/otpAPI');


const refer = require('./Express Routers/Referrals');

// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

// -------------------end_here----------------------------------------------


//-------------------------Dotenv Manager --------------------
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT;
const db = process.env.DB;


// closing dotenev files 

 



// ----------------------------connecting the Database ----------------------------------

mongoose.connect(db, ()=>
{
    console.log("Database in connected Successfully");
})


// --------------------------closing ----------------------------------------------------------







// ------------------------------------------close------------------------------------------------



// ------------------------------Opening then express server --------------------------


const app = express();

app.use(cors());


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


//Routes for the express server


app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));
app.use(express.static(path.join(__dirname + '/public')));

app.use('/v1/auth', loginRoute);
app.use('/v1/test', tests);
app.use('/v1/contact', customerContact);
app.use('/v1/category', category);
app.use('/v1/bank', bankCrud);
app.use('/v1/admin', Admin);
app.use('/v1/otp', otpapi);
app.use('/v1/referral', refer);
app.use('/v1/profile', profile);
app.use('/v1/transaction', transactions);
app.use('/v1/checkout', checkout);

 


app.listen(port, ()=>
{
    console.log(`Server up and running on port ${port}`);
})


// -------------------------------Closing the server----------------------------------------

