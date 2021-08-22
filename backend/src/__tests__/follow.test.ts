import app from "../app";
import supertest from "supertest";
import { dbDisconnect } from "../database/testDbConnect";

const firstUser = {
  firstName: "first",
  lastName: "user",
  email: "firstuser@gmail.com",
  username: "firstUser",
  password: "test1234",
  passwordConfirm: "test1234",
};

const secondUser = {
  firstName: "second",
  lastName: "user",
  email: "seconduser@gmail.com",
  username: "secondUser",
  password: "test1234",
  passwordConfirm: "test1234",
};

const url = "/api/social/v1";

let firstUserToken = "";
let secondUserToken = "";
let firstUserId = "";
let secondUserId = "";

beforeAll(async () => {
  const response = await supertest(app)
    .post(`${url}/users/signup`)
    .send(firstUser);

  firstUserToken = response.body.token.token;
  firstUserId = response.body.user._id;

  const response1 = await supertest(app)
    .post(`${url}/users/signup`)
    .send(secondUser);

  secondUserToken = response1.body.token.token;
  secondUserId = response1.body.user._id;
});

describe("Follow a user", () => {
  it("should follow a user", async () => {
    const response = await supertest(app)
      .post(`${url}/users/follow/${secondUserId}`)
      .set("Authorization", `Bearer ${firstUserToken}`);

    expect(response.status).toBe(200);
  });

  it("should have 1 follower", async () => {
    const user2 = {
      email: "seconduser@gmail.com",
      password: "test1234",
    };

    const response = await supertest(app)
      .post(`${url}/users/login`)
      .send(user2);

    expect(response.body.status).toBe("success");
    expect(response.body.user.followers.numberOfFollowers).toBe(1);
  });

  it("should have 1 following", async () => {
    const user1 = {
      email: "firstuser@gmail.com",
      password: "test1234",
    };

    const response = await supertest(app)
      .post(`${url}/users/login`)
      .send(user1);

    expect(response.body.status).toBe("success");
    expect(response.body.user.followings.numberOfFollowings).toBe(1);
  });
});

describe("Get Followers", () => {
  it("should get user followers", async () => {
    const response = await supertest(app)
      .get(`${url}/users/followers/${secondUserId}`)
      .set("Authorization", `Bearer ${secondUserToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.noOfResult).toBe(1);
  });
});

describe("Get Followings", () => {
  it("should get user followers", async () => {
    const response = await supertest(app)
      .get(`${url}/users/followings/${firstUserId}`)
      .set("Authorization", `Bearer ${firstUserToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.noOfResult).toBe(1);
  });
});
