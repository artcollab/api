import request from "supertest";
import app from "@index";
import { expect } from "chai";

describe("index", async () => {
  it("Init index page, returns hello world!!", async () => {
    const res = await request(app).get("/");

    expect(res.status).to.eql(200);
    expect(res.body.msg).to.eql("Hello world!?");
  });
});
