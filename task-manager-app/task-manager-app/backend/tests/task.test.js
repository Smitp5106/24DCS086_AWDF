const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const validateTaskId = require("../middleware/validateTaskId");
const validateContentType = require("../middleware/validateContentType");

describe("Task Management API — Unit & Middleware Tests", () => {
  describe("validateTaskId Middleware", () => {
    it("should call next() for a valid 24-character hex ObjectId", () => {
      let nextCalled = false;
      const req = { params: { id: "507f1f77bcf86cd799439011" } };
      const res = {};
      const next = () => {
        nextCalled = true;
      };

      validateTaskId(req, res, next);
      assert.strictEqual(nextCalled, true, "next() should be called for valid ObjectId");
    });

    it("should return HTTP 400 when task ID format is invalid", () => {
      let statusCode = null;
      let jsonResponse = null;

      const req = { params: { id: "invalid-id-123" } };
      const res = {
        status(code) {
          statusCode = code;
          return this;
        },
        json(data) {
          jsonResponse = data;
          return this;
        }
      };
      const next = () => {};

      validateTaskId(req, res, next);
      // FIXED TEST: Expecting correct HTTP 400 Bad Request
      assert.strictEqual(statusCode, 400, "Should respond with HTTP 400 Bad Request");
      assert.strictEqual(jsonResponse.success, false);
      assert.match(jsonResponse.error, /Invalid task ID format/);
    });
  });

  describe("validateContentType Middleware", () => {
    it("should allow POST request with application/json header", () => {
      let nextCalled = false;
      const req = {
        method: "POST",
        headers: { "content-type": "application/json" }
      };
      const res = {};
      const next = () => {
        nextCalled = true;
      };

      validateContentType(req, res, next);
      assert.strictEqual(nextCalled, true, "next() should be called for valid content-type");
    });

    it("should reject POST request with invalid content-type", () => {
      let statusCode = null;
      let jsonResponse = null;

      const req = {
        method: "POST",
        headers: { "content-type": "text/plain" }
      };
      const res = {
        status(code) {
          statusCode = code;
          return this;
        },
        json(data) {
          jsonResponse = data;
          return this;
        }
      };
      const next = () => {};

      validateContentType(req, res, next);
      assert.strictEqual(statusCode, 400, "Should reject non-JSON Content-Type with 400");
      assert.strictEqual(jsonResponse.success, false);
    });
  });
});
