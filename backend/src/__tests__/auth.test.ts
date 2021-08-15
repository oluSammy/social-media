import app from "../app";
import supertest from "supertest";
import { dbDisconnect } from "../database/testDbConnect";

/**
 * TESTS TO WRITE:
 * -- follow user, un follow user
 * -- search user / posts
 */

const url = "/api/social/v1";

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

    expect(response.body.status).toBe("success");
    expect(response.body.user.firstName).toBe("test");
    expect(response.body.user.username).toBe("testUser");
    expect(response.body).toHaveProperty("token");
    expect(response.status).toBe(200);
  });
});

describe('Update Profile', () => {
    it("should update user's profile", () => {
        
    })
})
