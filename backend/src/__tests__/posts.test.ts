import app from "../app";
import supertest from "supertest";
import { dbDisconnect } from "../database/testDbConnect";

const newUser = {
  firstName: "test",
  lastName: "user",
  email: "testuser@gmail.com",
  username: "testUser",
  password: "test1234",
  passwordConfirm: "test1234",
};

const url = "/api/social/v1";
let userToken = "";
let postId = "";

afterAll(async () => {
  await dbDisconnect();
});

beforeAll(async () => {
  const response = await supertest(app)
    .post(`${url}/users/signup`)
    .send(newUser);

  userToken = response.body.token.token;
});

describe("create post", () => {
  it("should create a post", async () => {
    const post = {
      text: "this is a test post",
    };

    const response = await supertest(app)
      .post(`${url}/post`)
      .send(post)
      .set("Authorization", `Bearer ${userToken}`);

    postId = response.body.post._id;

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.post.text).toBe(post.text);
  });
});

describe("Get one post", () => {
  it("should get one post", async () => {
    const response = await supertest(app)
      .get(`${url}/post/${postId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data.text).toBe("this is a test post");
  });
});

describe("Get timeline posts", () => {
  it("should get timeline post", async () => {
    const response = await supertest(app)
      .get(`${url}/post/timeline`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
  });
});

describe("Get user's posts", () => {
  it("should get posts of a user", async () => {
    const response = await supertest(app)
      .get(`${url}/post/timeline`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body).toHaveProperty("posts");
    expect(Array.isArray(response.body.posts)).toBe(true);
  });
});

describe("Like post", () => {
  it("should like a post", async () => {
    const response = await supertest(app)
      .post(`${url}/likes/${postId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.message).toBe("post liked");
  });

  it("should unlike a post", async () => {
    const response = await supertest(app)
      .post(`${url}/likes/${postId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.message).toBe("post un-liked");
  });
});

describe("comment on post", () => {
  it("should leave a comment on a post", async () => {
    const comment = {
      text: "alright, i'll just drop this here",
    };

    const response = await supertest(app)
      .post(`${url}/comments/${postId}`)
      .send(comment)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body).toHaveProperty("comment");
    expect(response.body.comment.text).toBe(comment.text);
  });
});

describe("Get post's comments", () => {
  it("should get comments of a post", async () => {
    const response = await supertest(app)
      .get(`${url}/comments/post/${postId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body).toHaveProperty("comments");
    expect(Array.isArray(response.body.comments)).toBe(true);
  });
});

describe("delete post", () => {
  it("should delete my post", async () => {
    const response = await supertest(app)
      .delete(`${url}/post/${postId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(204);
  });
});
