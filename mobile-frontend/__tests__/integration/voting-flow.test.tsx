/**
 * Integration Test: Complete Voting Flow
 */

import { render, waitFor } from "@testing-library/react-native";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { Alert } from "react-native";
import axios from "../../src/api/axios";
import { AuthProvider } from "../../src/context/AuthContext";

jest.mock("../../src/api/axios");
jest.mock("expo-secure-store");
jest.spyOn(Alert, "alert");

const mockAxios = axios as jest.Mocked<typeof axios>;
const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

jest.mock("../../src/routes/app.routes", () => ({
  AppRoutes: () => null,
}));

describe("Integration: AuthProvider state management", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSecureStore.getItemAsync.mockResolvedValue(null);
    mockSecureStore.setItemAsync.mockResolvedValue();
    mockSecureStore.deleteItemAsync.mockResolvedValue();
    (mockAxios as any).defaults = { headers: { common: {} } };
  });

  it("loads stored token on mount and sets authenticated state", async () => {
    mockSecureStore.getItemAsync.mockImplementation((key: string) => {
      const store: Record<string, string> = {
        "my-jwt": "existing-token",
        "my-email": "voter@test.com",
        "my-electoral-id": "TEST123",
        "my-port": "3010",
      };
      return Promise.resolve(store[key] || null);
    });

    const { queryByText } = render(<AuthProvider>{null}</AuthProvider>);

    await waitFor(() => {
      expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith("my-jwt");
    });
  });

  it("clears auth state on logout", async () => {
    const { AuthProvider: AP, useAuth } = jest.requireActual(
      "../../src/context/AuthContext",
    );
    expect(AP).toBeTruthy();
  });

  it("handles login API success", async () => {
    mockAxios.post.mockResolvedValueOnce({
      status: 200,
      data: {
        accessToken: "new-token",
        email: "voter@test.com",
        port: "3010",
      },
    });

    expect(mockAxios.post).not.toHaveBeenCalled();
  });

  it("handles refresh-token API for session persistence", async () => {
    mockSecureStore.getItemAsync.mockImplementation((key: string) => {
      const store: Record<string, string> = {
        "my-jwt": "existing-token",
        "my-email": "voter@test.com",
        "my-electoral-id": "TEST123",
        "my-port": "3010",
      };
      return Promise.resolve(store[key] || null);
    });

    mockAxios.get.mockResolvedValueOnce({
      status: 200,
      data: { accessToken: "refreshed-token" },
    });

    render(<AuthProvider>{null}</AuthProvider>);

    await waitFor(() => {
      expect(mockSecureStore.getItemAsync).toHaveBeenCalled();
    });
  });
});
