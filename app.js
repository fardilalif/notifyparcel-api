require("dotenv").config();
require("express-async-errors");
const cookieParser = require("cookie-parser");

const connectDB = require("./db/connect.js");
const express = require("express");
const app = express();

// custom middlewares
const notFound = require("./middlewares/not-found.js");
const errorHandler = require("./middlewares/error-handler.js");

// routers
const authRouter = require("./routes/authRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const parcelRouter = require("./routes/parcelRoutes.js");

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/parcels", parcelRouter);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
})();
