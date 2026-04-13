/**
 * Middleware tests for authentication and security
 */
const verifyJWT = require("../src/middleware/verifyJWT");
const verifyJWTWeb = require("../src/middleware/verifyJWTWeb");
const credentials = require("../src/middleware/credentials");
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

describe("Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {}, cookies: {} };
    res = {
      sendStatus: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      header: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  // ─── verifyJWT ────────────────────────────────────────────────────────────

  describe("verifyJWT", () => {
    test("should call next() and attach user when token is valid", () => {
      req.headers.authorization = "Bearer valid-token";
      jwt.verify.mockImplementation((_token, _secret, callback) => {
        callback(null, { electoralId: "test-id" });
      });

      verifyJWT(req, res, next);

      expect(jwt.verify).toHaveBeenCalled();
      expect(req.user).toEqual({ electoralId: "test-id" });
      expect(next).toHaveBeenCalled();
      expect(res.sendStatus).not.toHaveBeenCalled();
    });

    test("should return 401 when Authorization header is absent", () => {
      verifyJWT(req, res, next);
      expect(res.sendStatus).toHaveBeenCalledWith(401);
      expect(jwt.verify).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 403 when token is invalid/expired", () => {
      req.headers.authorization = "Bearer bad-token";
      jwt.verify.mockImplementation((_token, _secret, callback) => {
        callback(new Error("Invalid token"), null);
      });

      verifyJWT(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    test("should handle token without Bearer prefix", () => {
      req.headers.authorization = "raw-token";
      jwt.verify.mockImplementation((_token, _secret, callback) => {
        callback(null, { electoralId: "test-id" });
      });

      verifyJWT(req, res, next);

      expect(jwt.verify).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    test("should return 401 when Authorization header is empty string", () => {
      req.headers.authorization = "";
      verifyJWT(req, res, next);
      expect(res.sendStatus).toHaveBeenCalledWith(401);
    });

    test("should attach roles from decoded payload", () => {
      req.headers.authorization = "Bearer token";
      jwt.verify.mockImplementation((_token, _secret, callback) => {
        callback(null, { electoralId: "id", roles: ["admin"] });
      });

      verifyJWT(req, res, next);

      expect(req.roles).toEqual(["admin"]);
      expect(next).toHaveBeenCalled();
    });
  });

  // ─── verifyJWTWeb ─────────────────────────────────────────────────────────

  describe("verifyJWTWeb", () => {
    test("should call next() and attach user when token is valid", () => {
      req.headers.authorization = "Bearer valid-token";
      jwt.verify.mockImplementation((_token, _secret, callback) => {
        callback(null, { username: "admin" });
      });

      verifyJWTWeb(req, res, next);

      expect(req.user).toEqual({ username: "admin" });
      expect(next).toHaveBeenCalled();
      expect(res.sendStatus).not.toHaveBeenCalled();
    });

    test("should return 401 when Authorization header is absent", () => {
      verifyJWTWeb(req, res, next);
      expect(res.sendStatus).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 403 when token is invalid", () => {
      req.headers.authorization = "Bearer bad";
      jwt.verify.mockImplementation((_token, _secret, callback) => {
        callback(new Error("Bad token"), null);
      });

      verifyJWTWeb(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    test("should handle token without Bearer prefix", () => {
      req.headers.authorization = "raw-token";
      jwt.verify.mockImplementation((_token, _secret, callback) => {
        callback(null, { username: "u1" });
      });

      verifyJWTWeb(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  // ─── credentials ─────────────────────────────────────────────────────────

  describe("credentials middleware", () => {
    test("should set CORS header for allowed origin and call next()", () => {
      req.headers.origin = "http://localhost:3000";
      credentials(req, res, next);
      expect(res.header).toHaveBeenCalledWith(
        "Access-Control-Allow-Credentials",
        "true",
      );
      expect(next).toHaveBeenCalled();
    });

    test("should NOT set CORS header for disallowed origin but still call next()", () => {
      req.headers.origin = "http://evil.com";
      credentials(req, res, next);
      expect(res.header).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    test("should call next() even when there is no origin header", () => {
      credentials(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.header).not.toHaveBeenCalled();
    });

    test("should set header for every origin in the allowedOrigins list", () => {
      const allowed = [
        "http://localhost:3007",
        "http://localhost:3010",
        "http://127.0.0.1:5500",
        "http://localhost:3001",
      ];
      allowed.forEach((origin) => {
        jest.clearAllMocks();
        req.headers.origin = origin;
        credentials(req, res, next);
        expect(res.header).toHaveBeenCalledWith(
          "Access-Control-Allow-Credentials",
          "true",
        );
        expect(next).toHaveBeenCalled();
      });
    });
  });
});
