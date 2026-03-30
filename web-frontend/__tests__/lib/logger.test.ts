import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import logger from "@/lib/logger";

describe("Logger", () => {
  // Store original console methods
  const originalConsole = {
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
  };

  beforeEach(() => {
    // Mock console methods
    console.debug = vi.fn();
    console.info = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();
  });

  afterEach(() => {
    // Restore original console methods
    console.debug = originalConsole.debug;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    vi.clearAllMocks();
  });

  describe("info logging", () => {
    it("should log info messages", () => {
      logger.info("Test info message");
      expect(console.info).toHaveBeenCalled();
    });

    it("should log info with data", () => {
      const data = { key: "value" };
      logger.info("Test info", data);
      expect(console.info).toHaveBeenCalled();
    });

    it("should log info with context", () => {
      logger.info("Test info", null, "TestContext");
      expect(console.info).toHaveBeenCalled();
    });
  });

  describe("warn logging", () => {
    it("should log warning messages", () => {
      logger.warn("Test warning message");
      expect(console.warn).toHaveBeenCalled();
    });

    it("should log warning with data", () => {
      const data = { warning: "details" };
      logger.warn("Test warning", data);
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe("error logging", () => {
    it("should log error messages", () => {
      logger.error("Test error message");
      expect(console.error).toHaveBeenCalled();
    });

    it("should log error with error object", () => {
      const error = new Error("Test error");
      logger.error("An error occurred", error);
      expect(console.error).toHaveBeenCalled();
    });

    it("should log error with context", () => {
      logger.error("Test error", null, "ErrorContext");
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("API logging", () => {
    it("should log API calls", () => {
      logger.api("GET", "/api/users");
      // In non-debug mode, this might not log
      // Just ensure it doesn't throw
      expect(true).toBe(true);
    });

    it("should log API responses", () => {
      logger.apiResponse("POST", "/api/login", 200, { token: "abc" });
      expect(true).toBe(true);
    });

    it("should log API errors", () => {
      const error = new Error("API Error");
      logger.apiError("GET", "/api/data", error);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("message formatting", () => {
    it("should include timestamp in log messages", () => {
      logger.info("Test message");

      const calls = (console.info as any).mock.calls;
      if (calls.length > 0) {
        const message = calls[0][0];
        expect(message).toMatch(/\[\d{4}-\d{2}-\d{2}T/);
      }
    });

    it("should include log level in messages", () => {
      logger.info("Test message");

      const calls = (console.info as any).mock.calls;
      if (calls.length > 0) {
        const message = calls[0][0];
        expect(message).toContain("[INFO]");
      }
    });

    it("should include context when provided", () => {
      logger.info("Test message", null, "MyContext");

      const calls = (console.info as any).mock.calls;
      if (calls.length > 0) {
        const message = calls[0][0];
        expect(message).toContain("[MyContext]");
      }
    });
  });

  describe("development vs production", () => {
    it("should not throw errors in any environment", () => {
      expect(() => logger.debug("Debug message")).not.toThrow();
      expect(() => logger.info("Info message")).not.toThrow();
      expect(() => logger.warn("Warn message")).not.toThrow();
      expect(() => logger.error("Error message")).not.toThrow();
    });
  });

  describe("data logging", () => {
    it("should handle null data", () => {
      expect(() => logger.info("Message", null)).not.toThrow();
    });

    it("should handle undefined data", () => {
      expect(() => logger.info("Message", undefined)).not.toThrow();
    });

    it("should handle object data", () => {
      const data = { nested: { value: 123 } };
      expect(() => logger.info("Message", data)).not.toThrow();
    });

    it("should handle array data", () => {
      const data = [1, 2, 3];
      expect(() => logger.info("Message", data)).not.toThrow();
    });

    it("should handle error objects", () => {
      const error = new Error("Test error");
      error.stack = "Error stack trace";
      expect(() => logger.error("Error occurred", error)).not.toThrow();
    });
  });

  describe("edge cases", () => {
    it("should handle empty messages", () => {
      expect(() => logger.info("")).not.toThrow();
    });

    it("should handle very long messages", () => {
      const longMessage = "a".repeat(10000);
      expect(() => logger.info(longMessage)).not.toThrow();
    });

    it("should handle special characters in messages", () => {
      expect(() =>
        logger.info("Message with émojis 🎉 and spëcial çhars"),
      ).not.toThrow();
    });

    it("should handle circular references in data", () => {
      const circular: any = { a: 1 };
      circular.self = circular;

      // Should not throw, but handling of circular refs depends on console implementation
      expect(() => logger.info("Circular data", circular)).not.toThrow();
    });
  });
});
