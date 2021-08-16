import app from "../app";
import supertest from "supertest";
import { dbDisconnect } from "../database/testDbConnect";

/**
 * TESTS TO WRITE:
 * -- follow user, un follow user
 * -- search user / posts
 */

const url = "/api/social/v1";
let token = "";

afterAll(async () => {
  await dbDisconnect();
});

describe("Sign up", () => {
  it("should create account for a new user", async () => {
    const newUser = {
      firstName: "test",
      lastName: "user",
      email: "testuser@gmail.com",
      username: "testUser",
      password: "test1234",
      passwordConfirm: "test1234",
    };

    const response = await supertest(app)
      .post(`${url}/users/signup`)
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.user.firstName).toBe("test");
    expect(response.body.user.username).toBe("testUser");
    expect(response.body).toHaveProperty("token");
  });
});

describe("log in", () => {
  it("should log in with email and password", async () => {
    const user = {
      email: "testuser@gmail.com",
      password: "test1234",
    };

    const response = await supertest(app).post(`${url}/users/login`).send(user);

    expect(response.body.status).toBe("success");
    expect(response.body.user.firstName).toBe("test");
    expect(response.body.user.username).toBe("testUser");
    expect(response.body).toHaveProperty("token");
    expect(response.status).toBe(200);
  });

  it("should login with username and password", async () => {
    const user = {
      username: "testUser",
      password: "test1234",
    };

    const response = await supertest(app).post(`${url}/users/login`).send(user);

    token = response.body.token.token;

    expect(response.body.status).toBe("success");
    expect(response.body.user.firstName).toBe("test");
    expect(response.body.user.username).toBe("testUser");
    expect(response.body).toHaveProperty("token");
    expect(response.status).toBe(200);
  });
});

describe("Update Profile", () => {
  it("should update user's profile", async () => {
    const updatedUser = {
      firstName: "updated user",
    };

    const response = await supertest(app)
      .patch(`${url}/users/updateMe`)
      .send(updatedUser)
      .set("Authorization", `Bearer ${token}`);

    expect(response.body.message).toBe("profile update success");
    expect(response.status).toBe(200);
    expect(response.body.user.firstName).toBe("updated user");
  });
});

describe("update password", () => {
  it("should update user's password", async () => {
    const updatePassword = {
      prevPassword: "test1234",
      newPassword: "updatedPassword",
      newPasswordConfirm: "updatedPassword",
    };

    const response = await supertest(app)
      .patch(`${url}/users/updateMe`)
      .send(updatePassword)
      .set("Authorization", `Bearer ${token}`);

      console.log(response.body);

    // expect(response.body.status).toBe("success");
    expect(response.status).toBe(200);
  });
});

