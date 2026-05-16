const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// ── Mock firebase-admin BEFORE requiring routes ──────────────────────────────
jest.mock("firebase-admin", () => {
  const mockVerifyIdToken = jest.fn();
  return {
    apps: [],
    initializeApp: jest.fn(),
    credential: { cert: jest.fn() },
    auth: () => ({ verifyIdToken: mockVerifyIdToken }),
    _mockVerifyIdToken: mockVerifyIdToken,
  };
});

const admin = require("firebase-admin");
const router = require("../routes");

let app;
let mongoServer;

const VALID_TOKEN = "valid-test-token";
const TEST_UID = "test-uid-123";
const TEST_NAME = "Balaji";

const VALID_BODY = {
  nickname: "Pirate King",
  character: "Monkey D Luffy",
  anime: "One Piece",
  description: "The future Pirate King who ate the Gum-Gum fruit",
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  app = express();
  app.use(express.json());
  app.use("/api", router);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

// ── Helper: sets mock to resolve with test user ───────────────────────────────
function mockValidToken() {
  admin._mockVerifyIdToken.mockResolvedValueOnce({ uid: TEST_UID, name: TEST_NAME, email: "test@test.com" });
}

// ── Helper: authenticated POST to create a nickname ──────────────────────────
async function createNickname(body = VALID_BODY) {
  mockValidToken();
  return request(app)
    .post("/api/nicknames")
    .set("Authorization", `Bearer ${VALID_TOKEN}`)
    .send(body);
}

// ═════════════════════════════════════════════════════════════════════════════
// GET /api/nicknames
// ═════════════════════════════════════════════════════════════════════════════
describe("GET /api/nicknames", () => {
  it("returns 404 when no nicknames exist", async () => {
    const res = await request(app).get("/api/nicknames");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("No nicknames found");
  });

  it("returns 200 and list after nickname is created", async () => {
    await createNickname();
    const res = await request(app).get("/api/nicknames");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].nickname).toBe(VALID_BODY.nickname);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// GET /api/nicknames/:id
// ═════════════════════════════════════════════════════════════════════════════
describe("GET /api/nicknames/:id", () => {
  it("returns 400 for invalid MongoDB ID", async () => {
    const res = await request(app).get("/api/nicknames/not-a-valid-id");
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid ID format");
  });

  it("returns 404 for valid but non-existent ID", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/nicknames/${fakeId}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Nickname not found");
  });

  it("returns 200 and the nickname for a valid existing ID", async () => {
    const created = await createNickname();
    const id = created.body.nickname._id;
    const res = await request(app).get(`/api/nicknames/${id}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(id);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// GET /api/nicknames/user/:userId
// ═════════════════════════════════════════════════════════════════════════════
describe("GET /api/nicknames/user/:userId", () => {
  it("returns empty array for user with no nicknames", async () => {
    const res = await request(app).get("/api/nicknames/user/no-such-user");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns nicknames for the correct user", async () => {
    await createNickname();
    const res = await request(app).get(`/api/nicknames/user/${TEST_UID}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].created_by).toBe(TEST_UID);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// POST /api/nicknames
// ═════════════════════════════════════════════════════════════════════════════
describe("POST /api/nicknames", () => {
  it("returns 401 when no Authorization header", async () => {
    const res = await request(app).post("/api/nicknames").send(VALID_BODY);
    expect(res.status).toBe(401);
  });

  it("returns 401 when token is invalid", async () => {
    admin._mockVerifyIdToken.mockRejectedValueOnce(new Error("Invalid token"));
    const res = await request(app)
      .post("/api/nicknames")
      .set("Authorization", "Bearer bad-token")
      .send(VALID_BODY);
    expect(res.status).toBe(401);
  });

  it("returns 400 when nickname is too short (< 3 chars)", async () => {
    mockValidToken();
    const res = await request(app)
      .post("/api/nicknames")
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({ ...VALID_BODY, nickname: "ab" });
    expect(res.status).toBe(400);
  });

  it("returns 400 when description is too short (< 10 chars)", async () => {
    mockValidToken();
    const res = await request(app)
      .post("/api/nicknames")
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({ ...VALID_BODY, description: "short" });
    expect(res.status).toBe(400);
  });

  it("returns 400 when required fields are missing", async () => {
    mockValidToken();
    const res = await request(app)
      .post("/api/nicknames")
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({ nickname: "Test Nick" });
    expect(res.status).toBe(400);
  });

  it("returns 201 and saves nickname with valid data", async () => {
    const res = await createNickname();
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Nickname added successfully");
    expect(res.body.nickname.nickname).toBe(VALID_BODY.nickname);
    expect(res.body.nickname.created_by).toBe(TEST_UID);
    expect(res.body.nickname.created_by_name).toBe(TEST_NAME);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// PUT /api/nicknames/:id
// ═════════════════════════════════════════════════════════════════════════════
describe("PUT /api/nicknames/:id", () => {
  it("returns 401 when not authenticated", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).put(`/api/nicknames/${fakeId}`).send(VALID_BODY);
    expect(res.status).toBe(401);
  });

  it("returns 403 when a different user tries to update", async () => {
    const created = await createNickname();
    const id = created.body.nickname._id;

    // Different user token
    admin._mockVerifyIdToken.mockResolvedValueOnce({ uid: "other-uid", name: "Other", email: "other@test.com" });
    const res = await request(app)
      .put(`/api/nicknames/${id}`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({ ...VALID_BODY, nickname: "Changed Nick" });
    expect(res.status).toBe(403);
    expect(res.body.message).toBe("You can only edit your own nicknames");
  });

  it("returns 200 and updates when owner makes request", async () => {
    const created = await createNickname();
    const id = created.body.nickname._id;

    mockValidToken();
    const res = await request(app)
      .put(`/api/nicknames/${id}`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({ ...VALID_BODY, nickname: "Updated King" });
    expect(res.status).toBe(200);
    expect(res.body.nickname.nickname).toBe("Updated King");
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// DELETE /api/nicknames/:id
// ═════════════════════════════════════════════════════════════════════════════
describe("DELETE /api/nicknames/:id", () => {
  it("returns 401 when not authenticated", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/nicknames/${fakeId}`);
    expect(res.status).toBe(401);
  });

  it("returns 403 when a different user tries to delete", async () => {
    const created = await createNickname();
    const id = created.body.nickname._id;

    admin._mockVerifyIdToken.mockResolvedValueOnce({ uid: "hacker-uid", name: "Hacker", email: "h@test.com" });
    const res = await request(app)
      .delete(`/api/nicknames/${id}`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`);
    expect(res.status).toBe(403);
  });

  it("returns 200 and deletes when owner makes request", async () => {
    const created = await createNickname();
    const id = created.body.nickname._id;

    mockValidToken();
    const res = await request(app)
      .delete(`/api/nicknames/${id}`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Nickname deleted successfully");
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// POST /api/nicknames/:id/like
// ═════════════════════════════════════════════════════════════════════════════
describe("POST /api/nicknames/:id/like", () => {
  it("adds a like and returns liked: true", async () => {
    const created = await createNickname();
    const id = created.body.nickname._id;

    mockValidToken();
    const res = await request(app)
      .post(`/api/nicknames/${id}/like`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`);
    expect(res.status).toBe(200);
    expect(res.body.liked).toBe(true);
    expect(res.body.likes).toContain(TEST_UID);
  });

  it("removes like on second call (toggle)", async () => {
    const created = await createNickname();
    const id = created.body.nickname._id;

    // First like
    mockValidToken();
    await request(app)
      .post(`/api/nicknames/${id}/like`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`);

    // Second like = unlike
    mockValidToken();
    const res = await request(app)
      .post(`/api/nicknames/${id}/like`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`);
    expect(res.body.liked).toBe(false);
    expect(res.body.likes).not.toContain(TEST_UID);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// POST /api/nicknames/:id/comment
// ═════════════════════════════════════════════════════════════════════════════
describe("POST /api/nicknames/:id/comment", () => {
  it("returns 400 when text is empty", async () => {
    const created = await createNickname();
    const id = created.body.nickname._id;

    mockValidToken();
    const res = await request(app)
      .post(`/api/nicknames/${id}/comment`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({ text: "   " });
    expect(res.status).toBe(400);
  });

  it("returns 400 when comment exceeds 300 characters", async () => {
    const created = await createNickname();
    const id = created.body.nickname._id;

    mockValidToken();
    const res = await request(app)
      .post(`/api/nicknames/${id}/comment`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({ text: "a".repeat(301) });
    expect(res.status).toBe(400);
  });

  it("adds a comment successfully", async () => {
    const created = await createNickname();
    const id = created.body.nickname._id;

    mockValidToken();
    const res = await request(app)
      .post(`/api/nicknames/${id}/comment`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({ text: "Great nickname!" });
    expect(res.status).toBe(200);
    expect(res.body.comments.length).toBe(1);
    expect(res.body.comments[0].text).toBe("Great nickname!");
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// DELETE /api/nicknames/:id/comment/:commentId
// ═════════════════════════════════════════════════════════════════════════════
describe("DELETE /api/nicknames/:id/comment/:commentId", () => {
  it("deletes comment when owner requests", async () => {
    const created = await createNickname();
    const id = created.body.nickname._id;

    mockValidToken();
    const commented = await request(app)
      .post(`/api/nicknames/${id}/comment`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({ text: "Delete me" });
    const commentId = commented.body.comments[0]._id;

    mockValidToken();
    const res = await request(app)
      .delete(`/api/nicknames/${id}/comment/${commentId}`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`);
    expect(res.status).toBe(200);
    expect(res.body.comments.length).toBe(0);
  });

  it("returns 403 when a different user tries to delete comment", async () => {
    const created = await createNickname();
    const id = created.body.nickname._id;

    mockValidToken();
    const commented = await request(app)
      .post(`/api/nicknames/${id}/comment`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`)
      .send({ text: "Someone elses comment" });
    const commentId = commented.body.comments[0]._id;

    admin._mockVerifyIdToken.mockResolvedValueOnce({ uid: "different-uid", name: "Other", email: "o@test.com" });
    const res = await request(app)
      .delete(`/api/nicknames/${id}/comment/${commentId}`)
      .set("Authorization", `Bearer ${VALID_TOKEN}`);
    expect(res.status).toBe(403);
  });
});
