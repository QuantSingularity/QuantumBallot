import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api, api_private, getApiBaseUrl, getApiUrl } from "@/services/api";

vi.mock("axios");
vi.mock("@/context/SecureStore", () => ({
  getItemAsync: vi.fn(() => Promise.resolve("mock-token")),
  setItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
}));

describe("API Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("api instance", () => {
    it("should be configured with correct base URL", () => {
      expect(api.defaults.baseURL).toContain("/api");
    });

    it("should have correct timeout", () => {
      expect(api.defaults.timeout).toBeDefined();
    });

    it("should have JSON content type header", () => {
      expect(api.defaults.headers["Content-Type"]).toBe("application/json");
    });
  });

  describe("api_private", () => {
    it("should create instance with authorization token", async () => {
      const mockCreate = vi.fn().mockReturnValue({
        defaults: {
          baseURL: "http://localhost:3010/api",
        },
        interceptors: {
          response: {
            use: vi.fn(),
          },
        },
      });

      (axios.create as any) = mockCreate;

      const _instance = await api_private();

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
          headers: expect.objectContaining({
            Authorization: "Bearer mock-token",
          }),
        }),
      );
    });
  });

  describe("utility functions", () => {
    it("should return API base URL", () => {
      const baseUrl = getApiBaseUrl();
      expect(baseUrl).toBeDefined();
      expect(typeof baseUrl).toBe("string");
    });

    it("should return full API URL", () => {
      const apiUrl = getApiUrl();
      expect(apiUrl).toBeDefined();
      expect(apiUrl).toContain("/api");
    });
  });
});
