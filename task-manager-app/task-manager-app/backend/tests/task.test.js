const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const validateTaskId = require("../middleware/validateTaskId");
const validateContentType = require("../middleware/validateContentType");
const aiService = require("../services/aiService");
const { getAiSuggestions } = require("../controllers/taskController");

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

  describe("AI Task Assistant & Suggestion Service", () => {
    it("should auto-generate description, priority, and deadline from title", async () => {
      const suggestions = await aiService.generateTaskSuggestions(
        "Fix database timeout crash in production",
        ""
      );

      assert.ok(suggestions.suggestedDescription, "Should have a suggested description");
      assert.ok(["low", "medium", "high", "urgent"].includes(suggestions.suggestedPriority));
      assert.strictEqual(suggestions.suggestedPriority, "urgent", "Crash in production should be urgent");
      assert.ok(suggestions.suggestedDeadline, "Should propose a deadline");
      assert.ok(Array.isArray(suggestions.subtasks), "Should return subtasks list");
      assert.ok(suggestions.subtasks.length >= 2, "Should provide actionable subtasks");
    });

    it("should assign low priority to housekeeping and documentation tasks", async () => {
      const suggestions = await aiService.generateTaskSuggestions("Update README documentation format", "");
      assert.strictEqual(suggestions.suggestedPriority, "low");
      assert.ok(suggestions.suggestedDescription.length > 10);
    });

    it("should return HTTP 400 from getAiSuggestions controller when title is missing", async () => {
      let statusCode = null;
      let jsonResponse = null;

      const req = { body: {} };
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

      await getAiSuggestions(req, res, next);
      assert.strictEqual(statusCode, 400);
      assert.strictEqual(jsonResponse.success, false);
      assert.match(jsonResponse.error, /Please provide a task title/);
    });

    it("should return HTTP 200 with structured suggestions when valid title is provided", async () => {
      let statusCode = null;
      let jsonResponse = null;

      const req = {
        body: {
          title: "Prepare sprint backlog for review"
        }
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

      await getAiSuggestions(req, res, next);
      assert.strictEqual(statusCode, 200);
      assert.strictEqual(jsonResponse.success, true);
      assert.ok(jsonResponse.data.suggestedDescription);
      assert.ok(jsonResponse.data.suggestedPriority);
    });
  });
});
