import { describe, it, expect, vi, beforeEach } from "vitest";
import { logger } from "@/lib/logger";

describe("Logger", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("logger instance is defined", () => {
    expect(logger).toBeDefined();
  });

  it("has info method", () => {
    expect(typeof logger.info).toBe("function");
  });

  it("has warn method", () => {
    expect(typeof logger.warn).toBe("function");
  });

  it("has error method", () => {
    expect(typeof logger.error).toBe("function");
  });

  it("has debug method", () => {
    expect(typeof logger.debug).toBe("function");
  });

  it("info does not throw", () => {
    expect(() => logger.info("Test info message")).not.toThrow();
  });

  it("warn does not throw", () => {
    expect(() => logger.warn("Test warning")).not.toThrow();
  });

  it("error does not throw", () => {
    expect(() => logger.error("Test error")).not.toThrow();
  });

  it("debug does not throw", () => {
    expect(() => logger.debug("Test debug")).not.toThrow();
  });

  it("accepts additional context data", () => {
    expect(() =>
      logger.info("Message with data", { key: "value" }),
    ).not.toThrow();
  });

  it("handles error objects in error method", () => {
    const err = new Error("test error");
    expect(() => logger.error("Error occurred", err)).not.toThrow();
  });
});
