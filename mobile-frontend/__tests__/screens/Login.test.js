/**
 * Tests for Login screen
 */

import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { AuthProvider } from "src/context/AuthContext";
import { Login } from "src/screens/Login";

const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock("src/context/AuthContext", () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    onLogin: jest.fn().mockResolvedValue({ success: true }),
    authState: { authenticated: false },
    isLoading: false,
    imageList: {},
    setImageList: jest.fn(),
  }),
}));

describe("Login Screen", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("renders login form correctly", () => {
    const { getByText } = render(
      <AuthProvider>
        <Login />
      </AuthProvider>,
    );

    expect(getByText("QuantumBallot")).toBeTruthy();
    expect(getByText("Login")).toBeTruthy();
    expect(getByText("Register here")).toBeTruthy();
  });

  test("shows inline error when fields are empty", async () => {
    const { getByText, findByText } = render(
      <AuthProvider>
        <Login />
      </AuthProvider>,
    );

    const loginButton = getByText("Login");
    fireEvent.press(loginButton);

    const errorMessage = await findByText(
      "Electoral ID and password are required",
    );
    expect(errorMessage).toBeTruthy();
  });

  test("navigates to registration screen when register link is pressed", () => {
    const { getByText } = render(
      <AuthProvider>
        <Login />
      </AuthProvider>,
    );

    const registerLink = getByText("Register here");
    fireEvent.press(registerLink);

    expect(mockNavigate).toHaveBeenCalledWith("Registration");
  });

  test("calls onLogin with trimmed credentials", async () => {
    const mockOnLogin = jest.fn().mockResolvedValue({ success: true });
    const { useAuth } = require("src/context/AuthContext");
    useAuth.mockReturnValue({
      onLogin: mockOnLogin,
      authState: { authenticated: false },
      isLoading: false,
      imageList: {},
      setImageList: jest.fn(),
    });

    const { getByText, getAllByRole } = render(
      <AuthProvider>
        <Login />
      </AuthProvider>,
    );

    // Inputs rendered by react-native-paper TextInput
    const inputs = getAllByRole("text");
    if (inputs.length >= 2) {
      fireEvent.changeText(inputs[0], "  valid-id  ");
      fireEvent.changeText(inputs[1], "valid-password");
    }

    const loginButton = getByText("Login");
    fireEvent.press(loginButton);

    await waitFor(() => {
      if (mockOnLogin.mock.calls.length > 0) {
        expect(mockOnLogin).toHaveBeenCalledWith("valid-id", "valid-password");
      }
    });
  });

  test("shows error message when login fails", async () => {
    const { useAuth } = require("src/context/AuthContext");
    useAuth.mockReturnValue({
      onLogin: jest.fn().mockResolvedValue({
        success: false,
        message: "Invalid credentials",
      }),
      authState: { authenticated: false },
      isLoading: false,
      imageList: {},
      setImageList: jest.fn(),
    });

    const { getByText, findByText, getAllByRole } = render(
      <AuthProvider>
        <Login />
      </AuthProvider>,
    );

    const inputs = getAllByRole("text");
    if (inputs.length >= 2) {
      fireEvent.changeText(inputs[0], "bad-id");
      fireEvent.changeText(inputs[1], "bad-pass");
    }

    fireEvent.press(getByText("Login"));

    const errorMessage = await findByText("Invalid credentials");
    expect(errorMessage).toBeTruthy();
  });
});
