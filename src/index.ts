import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import connectDB from "./config/database";
import errorHandler from "./config/error";
import passport from "./config/passport";
import router from "./router";

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: "*", // Allow all origins
    credentials: true,
  })
);

// Body parser
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

// Session
app.use(
  session({
    secret: "session-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", router());

// Error handler
app.use(errorHandler);

// const server = http.createServer(app);

app.listen(8080, () => {
  console.log(`Server is running on host 8080`);
});
