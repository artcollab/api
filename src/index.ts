import express, { Application } from "express";
import morgan from "morgan";
import nocache from "nocache";

import swaggerDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import index from "@controller";
import eJwt from "express-jwt";

import mongoose from "mongoose";

import { login } from "@auth";

const app: Application = express();
const port = process.env.PORT;

const db: { [key: string]: string } = {
  username: process.env.DB_ADMIN_USERNAME as string,
  password: process.env.DB_ADMIN_PASSWORD as string,
  uri: process.env.DB_URI as string,
  port: process.env.DB_PORT as string,
};

const main = async () => {
  const uri = `mongodb://${db.username}:${db.password}@${db.uri}:${db.port}/drawdojo?authSource=admin`;
  try {
    console.log(db);
    await mongoose.connect(uri);

    console.log("Connected to mongoDB.");
  } catch (err) {
    console.log("Failed to connect to MongoDB", err);
  }

  app.set("etag", false);
  app.use(nocache());
  app.use(express.json());
  app.use(morgan("tiny"));
  app.use(express.urlencoded());

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(
      swaggerDoc({
        definition: {
          openapi: "3.0.0",
          info: {
            title: "Drawdojo",
            version: "0.0.1",
          },
        },
        apis: ["./src/controller/**/*.ts", "./src/schemas/**/*.ts"],
        servers: [
          {
            url: "https://api.operce.net/",
            description: "Main server",
          },
        ],
      })
    )
  );

  app.use(
    eJwt({
      secret: process.env.SEED as string,
      algorithms: ["HS256"],
    }).unless({
      path: ["/auth/login", "/auth/register", "/auth/refresh", "/docs", "/"],
    })
  );

  app.get("/", index);
  app.post("/auth/login", login);

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`listening on port ${port}`);
  });
};
main();

export default app;
