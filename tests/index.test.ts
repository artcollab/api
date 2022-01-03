import request from "supertest";
import app from "@index";
import { expect } from "chai";

describe("index", async () => {
  it("Init index page, returns hello world!!", async () => {
    const response = await request(app).get("/");

    expect(response.status).to.eql(200);
    expect(response.body.msg).to.eql("Hello world!");
  });
});

describe("daddy", async () => {
  it("Init daddy page, returns daddy!", async () => {
    const response = await request(app).get("/daddy");

    expect(response.status).to.eql(200);
    expect(response.body.msg).to.eql("daddy!");
  });
});
