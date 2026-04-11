import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { api, api_private, getApiBaseUrl, getApiUrl } from "@/services/api";

vi.mock("axios", async () => {
  const actual = await vi.importActual("axios");
  return {
    ...actual,
    create: vi.fn(() => ({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
      get: vi.fn(),
      post: vi.fn(),
    })),
    defaults: { headers: { common: {} } },
  };
});

vi.mock("@/context/SecureStore", () => ({
  getItemAsync: vi.fn().mockResolvedValue("mock-token"),
}));

vi.mock("@/global/globalVariables", () => ({
  GLOBAL_VARIABLES: { LOCALHOST: "localhost:3010" },
  TOKEN_KEY: "my-jwt",
}));

describe("API Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("api instance is defined", () => {
    expect(api).toBeDefined();
  });

  it("getApiBaseUrl returns a string", () => {
    const url = getApiBaseUrl();
    expect(typeof url).toBe("string");
    expect(url.length).toBeGreaterThan(0);
  });

  it("getApiUrl returns a string with /api", () => {
    const url = getApiUrl();
    expect(url).toContain("/api");
  });

  it("api_private is a function", () => {
    expect(typeof api_private).toBe("function");
  });

  it("api_private returns a promise", async () => {
    const result = api_private();
    expect(result).toBeInstanceOf(Promise);
  });

  it("api_private resolves to an axios instance", async () => {
    const instance = await api_private();
    expect(instance).toBeDefined();
    expect(typeof instance.get).toBe("function");
  });
});
