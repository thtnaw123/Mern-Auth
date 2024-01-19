const express = require("express");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

connectDB();
app.get("/", (req, res) => {
  console.log("first");
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   console.log(req.path, req.method);
//   next();
// });

const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
  console.log(`listening on port ${port} ...`);
});

app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);
