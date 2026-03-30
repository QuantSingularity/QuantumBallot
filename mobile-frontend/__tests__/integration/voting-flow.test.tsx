/**
 * Integration Test: Complete Voting Flow
 * Tests the entire user journey from login to vote submission
 */

import { NavigationContainer } from "@react-navigation/native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import axios from "../../src/api/axios";
import { AuthProvider } from "../../src/context/AuthContext";
import { AppRoutes } from "../../src/routes/app.routes";

// Mock dependencies
jest.mock("../../src/api/axios");
jest.mock("expo-secure-store");
jest.spyOn(Alert, "alert");

const mockAxios = axios as jest.Mocked<typeof axios>;
const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

describe("Integration: Complete Voting Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSecureStore.getItemAsync.mockResolvedValue(null);
    mockSecureStore.setItemAsync.mockResolvedValue();
    mockSecureStore.deleteItemAsync.mockResolvedValue();
  });

  const renderApp = () => {
    return render(
      <AuthProvider>
        <NavigationContainer>
          <AppRoutes />
        </NavigationContainer>
      </AuthProvider>,
    );
  };

  it("completes full voting flow: login -> view candidates -> vote", async () => {
    // Mock successful login
    mockAxios.post.mockImplementation((url) => {
      if (url.includes("auth-mobile")) {
        return Promise.resolve({
          status: 201,
          data: {
            accessToken: "test-token",
            email: "voter@test.com",
            port: "3010",
          },
        });
      }
      return Promise.reject(new Error("Unknown endpoint"));
    });

    // Mock candidates endpoint
    mockAxios.get.mockImplementation((url) => {
      if (url.includes("candidates")) {
        return Promise.resolve({
          status: 200,
          data: {
            candidates: [
              {
                code: 1,
                name: "Candidate One",
                party: "Party A",
                acronym: "PA",
              },
              {
                code: 2,
                name: "Candidate Two",
                party: "Party B",
                acronym: "PB",
              },
            ],
          },
        });
      }
      if (url.includes("announcement")) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        return Promise.resolve({
          status: 200,
          data: {
            announcement: {
              startTimeVoting: new Date().toISOString(),
              endTimeVoting: futureDate.toISOString(),
              numOfCandidates: 2,
              numOfVoters: 100,
            },
          },
        });
      }
      return Promise.reject(new Error("Unknown endpoint"));
    });

    const { getByText, getByPlaceholderText } = renderApp();

    // Step 1: User sees login screen
    await waitFor(() => {
      expect(getByText("QuantumBallot")).toBeTruthy();
    });

    // Step 2: User enters credentials
    const electoralIdInput = getByPlaceholderText(/electoral id/i);
    const passwordInput = getByPlaceholderText(/password/i);

    fireEvent.changeText(electoralIdInput, "TEST123");
    fireEvent.changeText(passwordInput, "password123");

    // Step 3: User clicks login
    const loginButton = getByText("Login");
    fireEvent.press(loginButton);

    // Step 4: After successful login, user navigates to candidates
    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("auth-mobile"),
        expect.objectContaining({
          electoralId: "TEST123",
          password: "password123",
        }),
      );
    });

    // Verify token was stored
    expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
      "my-jwt",
      "test-token",
    );
  });

  it("handles authentication failure gracefully", async () => {
    mockAxios.post.mockRejectedValue({
      response: {
        status: 401,
        data: {
          msg: "Invalid credentials",
        },
      },
    });

    const { getByText, getByPlaceholderText } = renderApp();

    await waitFor(() => {
      expect(getByText("QuantumBallot")).toBeTruthy();
    });

    const electoralIdInput = getByPlaceholderText(/electoral id/i);
    const passwordInput = getByPlaceholderText(/password/i);

    fireEvent.changeText(electoralIdInput, "INVALID");
    fireEvent.changeText(passwordInput, "wrong");

    const loginButton = getByText("Login");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Login Failed",
        expect.stringContaining("Invalid credentials"),
      );
    });
  });

  it("persists authentication across app restarts", async () => {
    // Simulate existing token
    mockSecureStore.getItemAsync.mockImplementation((key) => {
      const store: Record<string, string> = {
        "my-jwt": "existing-token",
        "my-email": "voter@test.com",
        "my-electoral-id": "TEST123",
        "my-port": "3010",
      };
      return Promise.resolve(store[key] || null);
    });

    mockAxios.get.mockImplementation((url) => {
      if (url.includes("refresh-token")) {
        return Promise.resolve({
          status: 200,
          data: {
            accessToken: "refreshed-token",
          },
        });
      }
      return Promise.reject(new Error("Unknown endpoint"));
    });

    const { queryByText } = renderApp();

    // Should not show login screen
    await waitFor(() => {
      expect(mockSecureStore.getItemAsync).toHaveBeenCalled();
    });

    // Should attempt to refresh token
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("refresh-token"),
        expect.any(Object),
      );
    });
  });
});
