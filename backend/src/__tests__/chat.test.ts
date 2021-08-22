import app from "../app";
import supertest from "supertest";
import { dbDisconnect } from "../database/testDbConnect";

const user1 = {
  firstName: "test",
  lastName: "user1",
  email: "testuser1@gmail.com",
  username: "testUser1",
  password: "test1234",
  passwordConfirm: "test1234",
};

const user2 = {
  firstName: "test",
  lastName: "user2",
  email: "testuser2@gmail.com",
  username: "testUser2",
  password: "test1234",
  passwordConfirm: "test1234",
};

const url = "/api/social/v1";
let user1Token = "";
let user1Id = "";
let user2Token = "";
let user2Id = "";

afterAll(async () => {
  await dbDisconnect();
});

beforeAll(async () => {
  const response1 = await supertest(app)
    .post(`${url}/users/signup`)
    .send(user1);

  user1Token = response1.body.token.token;
  user1Id = response1.body.user._id;

  const response2 = await supertest(app)
    .post(`${url}/users/signup`)
    .send(user2);

  user2Token = response2.body.token.token;
  user2Id = response2.body.user._id;
});

describe("create chat message", () => {
  it("should send chat message", async () => {
    const chat = {
      text: "Hello",
    };

    const response = await supertest(app)
      .post(`${url}/chats/${user2Id}`)
      .send(chat)
      .set("Authorization", `Bearer ${user1Token}`);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.chat.users).toContain(user2Id);
    expect(response.body.chat.users).toContain(user1Id);
  });
});

describe("reply chat message", () => {
  it("should reply a chat message", async () => {
    const chat = {
      text: "Hello bro!",
    };

    const response = await supertest(app)
      .post(`${url}/chats/${user1Id}`)
      .send(chat)
      .set("Authorization", `Bearer ${user2Token}`);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.chat.users).toContain(user2Id);
    expect(response.body.chat.users).toContain(user1Id);
  });
});

describe("Get Chat Messages", () => {
  it("should get chat messages of two users", async () => {
    const response = await supertest(app)
      .get(`${url}/chats/chat-messages/${user1Id}`)
      .send("chat")
      .set("Authorization", `Bearer ${user2Token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
  });
});
