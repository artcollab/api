/* eslint-disable no-console */
import express, { Application, Response as ExResponse, Request as ExRequest, NextFunction, } from "express";

import morgan from "morgan";
import nocache from "nocache";

import { RegisterRoutes } from "@tsoa/routes";
import { ValidateError } from "tsoa";

import swaggerUi from "swagger-ui-express";
import swaggerDoc from "@tsoa/swagger.json";

import mongoose from 'mongoose';

const app: Application = express();
const port = process.env.PORT || 3000;

const dbUsername =  process.env.DB_ADMIN_USERNAME;
const dbPassword = process.env.DB_ADMIN_PASSWORD;
const dbURI = process.env.DB_URI;
const dbPort = process.env.DB_PORT;

const uri = `mongodb://${dbUsername}:${dbPassword}@${dbURI}:${dbPort}/drawdojo?authSource=admin`;

mongoose.connect(uri);

mongoose.connection.on('open', () => {console.log('Connected to mongo server.');});

// TODO - Swap console.error for some proper logging
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.set("etag", false);
app.use(nocache());
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.urlencoded());

RegisterRoutes(app);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(function errorHandler(
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction
): ExResponse | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  if (err instanceof Error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }

  next();
});

app.use(function notFoundHandler(_req, res: ExResponse) {
  res.status(404).send({
    message: "Not Found",
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

export default app;