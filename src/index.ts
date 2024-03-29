/* eslint-disable no-console */

import express, { Application } from "express";
import eJwt from "express-jwt";
import nocache from "nocache";
import morgan from "morgan";

import swaggerUi from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";
import doc from "@doc";

import index from "@controller";

import { login } from "@auth";

import UserController from "@controller/users";

import db from "@db";

const app: Application = express();

const main = async () => {
  
  const port = process.env.PORT;

  db();

  app.set("etag", false);
  app.use(nocache());
  app.use(express.json());
  app.use(morgan("tiny"));
  app.use(express.urlencoded());

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc(doc)));

  app.use(
    eJwt({
      secret: process.env.SEED as string,
      algorithms: ["HS256"],
    }).unless({
      path: ["/auth/login", "/auth/register", "/auth/refresh", "/docs", "/"],
    })
  );

  // Index
  app.get("/", index);
  
  // Auth routes
  app.post("/auth/login", login);

  // User routes
  app.get("/users", UserController.getAllUsers);
  app.get("/users/id/:id", UserController.getUserByID);
  app.get("/users/name/:username", UserController.getUserByUsername);

  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
  
}

main();

export default app;
