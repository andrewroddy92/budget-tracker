const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const mongojs = require("mongojs");
const compression = require("compression");

//-------------- EXPRESS SERVER ---------------

const PORT = process.env.PORT || 3000;
const app = express();

//-------------- LOGGER ---------------

app.use(logger("dev"));

//--------------  REQ/RES handlers ---------------

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//--------------  MONGO DB ---------------

const databaseUrl = 'budget'
const collections = ['budget'];

const db = mongojs(databaseUrl, collections);

db.on("error", error => {
    console.log("Database Error:", error);
});

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget",   {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  });

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});