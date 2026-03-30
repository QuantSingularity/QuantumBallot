import { describe, expect, it } from "vitest";
import {
  candidateSchema,
  citizenSchema,
  electionAnnouncementSchema,
  formatValidationErrors,
  loginSchema,
  registerUserSchema,
  voteSchema,
} from "@/lib/validations";

describe("Validation Schemas", () => {
  describe("loginSchema", () => {
    it("should validate correct login data", () => {
      const validData = {
        username: "testuser",
        password: "password123",
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject short username", () => {
      const invalidData = {
        username: "ab",
        password: "password123",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain(
          "at least 3 characters",
        );
      }
    });

    it("should reject short password", () => {
      const invalidData = {
        username: "testuser",
        password: "12345",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain(
          "at least 6 characters",
        );
      }
    });
  });

  describe("registerUserSchema", () => {
    it("should validate correct registration data", () => {
      const validData = {
        name: "John Doe",
        username: "johndoe",
        password: "password123",
        confirmPassword: "password123",
        role: "NORMAL" as const,
      };

      const result = registerUserSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject mismatched passwords", () => {
      const invalidData = {
        name: "John Doe",
        username: "johndoe",
        password: "password123",
        confirmPassword: "password456",
        role: "NORMAL" as const,
      };

      const result = registerUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("don't match");
      }
    });

    it("should reject invalid role", () => {
      const invalidData = {
        name: "John Doe",
        username: "johndoe",
        password: "password123",
        confirmPassword: "password123",
        role: "INVALID" as any,
      };

      const result = registerUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("candidateSchema", () => {
    it("should validate correct candidate data", () => {
      const validData = {
        name: "Jane Smith",
        code: 123,
        party: "Democratic Party",
        acronym: "DP",
        status: "active" as const,
      };

      const result = candidateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject negative candidate code", () => {
      const invalidData = {
        name: "Jane Smith",
        code: -1,
        party: "Democratic Party",
        acronym: "DP",
        status: "active" as const,
      };

      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject too long acronym", () => {
      const invalidData = {
        name: "Jane Smith",
        code: 123,
        party: "Democratic Party",
        acronym: "VERYLONGACRONYM",
        status: "active" as const,
      };

      const result = candidateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("citizenSchema", () => {
    it("should validate correct citizen data", () => {
      const validData = {
        name: "John Citizen",
        electoralId: "EC12345",
        email: "john@example.com",
        address: "123 Main St, City",
        province: "Province A",
      };

      const result = citizenSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidData = {
        name: "John Citizen",
        electoralId: "EC12345",
        email: "invalid-email",
        address: "123 Main St, City",
        province: "Province A",
      };

      const result = citizenSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("Invalid email");
      }
    });
  });

  describe("electionAnnouncementSchema", () => {
    it("should validate correct election announcement", () => {
      const startDate = new Date("2025-01-01");
      const endDate = new Date("2025-12-31");

      const validData = {
        title: "General Election 2025",
        description: "Annual general election for all positions",
        startDate,
        endDate,
      };

      const result = electionAnnouncementSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject end date before start date", () => {
      const startDate = new Date("2025-12-31");
      const endDate = new Date("2025-01-01");

      const invalidData = {
        title: "General Election 2025",
        description: "Annual general election for all positions",
        startDate,
        endDate,
      };

      const result = electionAnnouncementSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain("after start date");
      }
    });
  });

  describe("voteSchema", () => {
    it("should validate correct vote data", () => {
      const validData = {
        identifier: "VOTER123",
        choiceCode: 42,
      };

      const result = voteSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid choice code", () => {
      const invalidData = {
        identifier: "VOTER123",
        choiceCode: -1,
      };

      const result = voteSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("formatValidationErrors", () => {
    it("should format validation errors correctly", () => {
      const invalidData = {
        username: "ab",
        password: "123",
      };

      const result = loginSchema.safeParse(invalidData);

      if (!result.success) {
        const formatted = formatValidationErrors(result.error);
        expect(formatted).toHaveProperty("username");
        expect(formatted).toHaveProperty("password");
        expect(typeof formatted.username).toBe("string");
        expect(typeof formatted.password).toBe("string");
      }
    });
  });
});
