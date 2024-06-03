import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router";

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

server.listen(8080, () => {
  console.log(`Server is running on host 8080`);
});

// first: Trung Anh test db co chay on hay khong, neu khong Trung Anh co the change url nay thanh url local cua Trung Anh
const MONGO_URL =
  "mongodb+srv://harry:harry@cluster0.p5hykkj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.Promise = Promise;

mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log({ error }));

app.use("/", router());
