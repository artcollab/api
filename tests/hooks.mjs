import db from "@db";

export const mochaHooks = {
  beforeAll(done) {
    await db();
    done();
  },
};
