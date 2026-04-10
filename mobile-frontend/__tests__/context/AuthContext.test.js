/**
 * Tests for AuthContext
 */

import { act, renderHook } from "@testing-library/react-native";
import React from "react";
import {
  AuthProvider,
  TOKEN_ELECTORAL_ID,
  TOKEN_EMAIL,
  TOKEN_KEY,
  TOKEN_PORT,
  useAuth,
} from "src/context/AuthContext";
import { mockAxios } from "../fixtures/mockAxios";
import { mockSecureStore } from "../fixtures/mockSecureStore";

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe("AuthContext", () => {
  beforeEach(() => {
    mockSecureStore.resetStore();
    mockAxios.mockClear();
    mockAxios.defaults.headers.common.Authorization = "";
    mockAxios.defaults.headers.common.Cookie = "";
  });

  test("should initialize with null auth values", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.authState).toEqual({
      token: null,
      authenticated: null,
      email: null,
      electoralId: null,
      port: null,
    });
  });

  test("should load token from secure store on initialization", async () => {
    await mockSecureStore.setItemAsync(TOKEN_KEY, "test-token");
    await mockSecureStore.setItemAsync(TOKEN_EMAIL, "test@example.com");
    await mockSecureStore.setItemAsync(TOKEN_ELECTORAL_ID, "test-id");
    await mockSecureStore.setItemAsync(TOKEN_PORT, "3010");

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(result.current.authState.token).toBe("test-token");
    expect(result.current.authState.authenticated).toBe(true);
    expect(result.current.authState.email).toBe("test@example.com");
    expect(result.current.authState.electoralId).toBe("test-id");

    expect(mockAxios.defaults.headers.common.Authorization).toBe(
      "Bearer test-token",
    );
    expect(mockAxios.defaults.headers.common.Cookie).toBe("jwt=test-token");
  });

  test("should successfully login with valid credentials", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.onLogin("valid-id", "valid-password");
    });

    expect(mockAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("auth-mobile"),
      {
        electoralId: "valid-id",
        password: "valid-password",
      },
    );

    expect(result.current.authState.authenticated).toBe(true);
    expect(result.current.authState.token).toBe("mock-access-token");
    expect(result.current.authState.email).toBe("test@example.com");
    expect(result.current.authState.port).toBe("3010");

    expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
      TOKEN_KEY,
      "mock-access-token",
    );
    expect(mockAxios.defaults.headers.common.Authorization).toBe(
      "Bearer mock-access-token",
    );
  });

  test("should return error on login failure", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let loginResult;
    await act(async () => {
      loginResult = await result.current.onLogin(
        "invalid-id",
        "wrong-password",
      );
    });

    expect(loginResult.success).toBe(false);
    expect(loginResult.error).toBe(true);
    expect(loginResult.message).toBeTruthy();
    expect(result.current.authState.authenticated).toBe(null);
  });

  test("should successfully logout", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.onLogin("valid-id", "valid-password");
    });

    expect(result.current.authState.authenticated).toBe(true);

    await act(async () => {
      await result.current.onLogOut();
    });

    expect(result.current.authState).toEqual({
      token: null,
      authenticated: false,
      email: null,
      electoralId: null,
      port: null,
    });

    expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith(TOKEN_KEY);
    expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith(TOKEN_EMAIL);
    expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith(
      TOKEN_ELECTORAL_ID,
    );
    expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith(TOKEN_PORT);

    expect(mockAxios.defaults.headers.common.Authorization).toBe("");
    expect(mockAxios.defaults.headers.common.Cookie).toBe("");
  });

  test("should check if user is logged in via refresh token", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await mockSecureStore.setItemAsync(TOKEN_KEY, "test-token");

    let checkResult;
    await act(async () => {
      checkResult = await result.current.isLoggedIn();
    });

    expect(mockAxios.get).toHaveBeenCalledWith(
      expect.stringContaining("refresh-token"),
      { withCredentials: true },
    );
  });

  test("should manage image list state", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    const testImageList = {
      "john.doe": "https://example.com/john.jpg",
      "democratic.party": "https://example.com/dem.jpg",
    };

    await act(async () => {
      result.current.setImageList(testImageList);
    });

    expect(result.current.imageList).toEqual(testImageList);
  });

  test("should start with isLoading true then set to false", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    // After effect runs, loading should be false
    expect(result.current.isLoading).toBe(false);
  });
});
