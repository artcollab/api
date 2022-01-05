import app from "@index";
import UserModel from "@models/user";
import chai from "chai";
import chaiHttp from "chai-http";

const { expect } = chai;


chai.use(chaiHttp);

describe ("Users", () => {

  before((done) => {

    UserModel.create({
        id: 1,
        email: "test2@test.co.uk",
        name: "Test two",
        phoneNumbers: ["22222222222"]
    }, () => {

      done();

    });

  });

  describe("GET /users", () => {

    it("Should return an array of users in the database", (done) => {

      chai.request(app).get("/users").end((err, res) => {

          if (err) done(err);

          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();

      });

    });

  });


  // Empty the database after running tests
  after((done) => {

    UserModel.remove({}, () => {
      done();
    });

  })

});