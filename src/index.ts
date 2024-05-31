import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router";

const localhost = "localhost";
const PORT = 8080;

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on http://${localhost}:${PORT}`);
});

// first: Trung Anh test db co chay on hay khong, neu khong Trung Anh co the change url nay thanh url local cua Trung Anh
const MONGO_URL = "mongodb://localhost:27017";
mongoose.Promise = Promise;

mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log({ error }));

app.use("/", router());
