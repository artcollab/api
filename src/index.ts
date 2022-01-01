import express, { Application } from "express";
import morgan from "morgan";
import nocache from "nocache";

import { RegisterRoutes } from "@tsoa/routes";

const main = async () => {
  const app: Application = express();
  const port = process.env.PORT || 3000;

  app.set("etag", false);
  app.use(nocache());
  app.use(express.json());
  app.use(morgan("tiny"));
  app.use(express.urlencoded());

  RegisterRoutes(app);

  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
};

main();
