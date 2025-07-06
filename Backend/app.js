require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api", userRoutes);

app.listen(5000, () => {
  console.log("server is running");
});
