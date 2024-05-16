import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";

import { config } from "./configs/config";
import { runCronJobs } from "./crons";
import { ApiError } from "./errors/api-error";
import { authRouter } from "./routers/auth.router";
import { userRouter } from "./routers/user.router";
import fileUpload from "express-fileupload";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../docs/swagger.json";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/users", userRouter);
app.use("/auth", authRouter);


app.use(
  "*",
  (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    return res.status(err.status || 500).json(err.message);
  },
);

process.on("uncaughtException", (error) => {
  console.error("An uncaught error occurred: " + error);
  process.exit(1);
});
app.listen(config.PORT, config.HOST, async () => {
  await mongoose.connect(config.MONGO_URL, {});
  console.log(`Server running http://${config.HOST}:${config.PORT}/`);
  runCronJobs();
});
