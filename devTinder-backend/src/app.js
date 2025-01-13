const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const userAuth = require("./middleware/userAuth.js");
const authRouter = require("./routes/auth.js");
const profileRouter = require('./routes/profile.js');
const requestRouter = require('./routes/requests.js');
const userRouter = require('./routes/user.js');
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // Update this if your React app is hosted elsewhere
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], // Allow your PATCH method here
  // allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("db connected succesfully");
    app.listen(3400, () => {
      console.log("testing");
    });
  })
  .catch((err) => {
    console.log("failded" + err);
  });
