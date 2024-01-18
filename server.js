const express = require("express");
const app = express();
const port = 5000;
const { mongourl } = require("./db.js");
const cors = require("cors");

app.use(cors());
const mongoose = require("mongoose");
require("./models/model");
require("./models/post");

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/createPost"));

mongoose.connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", () => {
    console.log("Successfully connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
});

app.listen(port, () => {
    console.log("Server is running on port", port);
});
