console.log("Hello Student Developer");

// ------------------------All files ---------------------------------

const express = require("express");
const loginRoute = require("./Express Routers/Auth");

const tests = require("./Express Routers/createTest");
const transactions = require("./Express Routers/Transaction");
// const bcrypt = require('brcypt');
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cors = require("cors");
const YAML = require("yamljs");
const tags = require("./Express Routers/Tags");
const subjects = require("./Express Routers/Subject");
const sectionRoute = require("./Express Routers/Section");
const questionRoute = require("./Express Routers/Question");

const Admin = require("./Express Routers/AdminRoles");
const checkout = require("./Express Routers/Checkout");

const swaggerUI = require("swagger-ui-express");

const swaggerJsDocs = YAML.load("./api.yaml");

const customerContact = require("./Express Routers/customerContact");
const analytics = require("./Express Routers/analytics");

const category = require("./Express Routers/Category");
const bankCrud = require("./Express Routers/BankCrud");
const profile = require("./Express Routers/profile");
const otpapi = require("./Express Routers/otpAPI");
const banner = require("./Express Routers/Banner");
const payout = require("./Express Routers/Payout");
const testHistory = require("./Express Routers/testTaken");
const testTrack = require("./Express Routers/TakeTest");
const userSpecificTest = require("./Express Routers/UserSpecificTest");
const Configuration = require("./Express Routers/Configuration");
const backup = require("./Express Routers/dbBackup");

const refer = require("./Express Routers/Referrals");

// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

// -------------------end_here----------------------------------------------

//-------------------------Dotenv Manager --------------------
const dotenv = require("dotenv");
const { TestHistory } = require("./models/TakenTest");

dotenv.config();

const port = process.env.PORT;
const db = process.env.DB;

// closing dotenev files
console.log("Hello world");

// ----------------------------connecting the Database ----------------------------------

mongoose.connect(db, () => {
	console.log("Database in connected Successfully ");
	
console.log(mongoose.connection.readyState);
});

// --------------------------closing ----------------------------------------------------------

// ------------------------------------------close------------------------------------------------

// ------------------------------Opening then express server --------------------------

const app = express();

app.use(cors());

// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))

// // parse application/json
// app.use(bodyParser.json())

app.use(bodyParser.json({ limit: "50mb" }));

app.use(
	bodyParser.urlencoded({
		limit: "50mb",
		extended: true,
		parameterLimit: 50000,
	})
);

//Routes for the express server

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));
// app.use(express.static(__dirname));
app.use("/images", express.static("images"));

app.use("/v1/auth", loginRoute);
app.use("/v1/test", tests);
app.use("/v1/contact", customerContact);
app.use("/v1/category", category);
app.use("/v1/bank", bankCrud);
app.use("/v1/admin", Admin);
app.use("/v1/otp", otpapi);
app.use("/v1/referral", refer);
app.use("/v1/profile", profile);
app.use("/v1/transaction", transactions);
app.use("/v1/checkout", checkout);
app.use("/static", express.static("images"));
app.use("/v1/analytics", analytics);
app.use("/v1/banner", banner);
app.use("/v1/payout", payout);
app.use("/v1/testHistory", testHistory);
app.use("/v1/tags", tags);
app.use("/v1/subject", subjects);
app.use("/v1/section", sectionRoute);
app.use("/v1/question", questionRoute);
app.use("/v1/track", testTrack);
app.use("/v1/response", userSpecificTest);
app.use("/v1/config", Configuration);
app.use("/v1/dbBackup", backup);

app.listen(port, () => {
	console.log(`Server up and running on port ${port}`);
});

// -------------------------------Closing the server----------------------------------------
