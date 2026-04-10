/**
 * Tests for Registration screen
 */

import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";
import { Registration } from "src/screens/Registration";

const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock("src/context/AuthContext", () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    onRegister: jest.fn().mockResolvedValue({
      success: true,
      message: "Registration successful!",
    }),
    authState: { authenticated: false },
    isLoading: false,
    imageList: {},
    setImageList: jest.fn(),
  }),
}));

jest.spyOn(Alert, "alert");

describe("Registration Screen", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    Alert.alert.mockClear();
  });

  test("renders registration form correctly", () => {
    const { getByText } = render(<Registration />);
    expect(getByText("Create Account")).toBeTruthy();
    expect(getByText("Join QuantumBallot Voting System")).toBeTruthy();
    expect(getByText("Create Account")).toBeTruthy();
  });

  test("shows error alert when required fields are missing", async () => {
    const { getByText } = render(<Registration />);

    const submitButton = getByText("Create Account");
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Please fill in all fields",
      );
    });
  });

  test("navigates to Login when already have account link pressed", () => {
    const { getByText } = render(<Registration />);

    const loginLink = getByText("Login here");
    fireEvent.press(loginLink);

    expect(mockNavigate).toHaveBeenCalledWith("Login");
  });

  test("navigates to Login via back button", () => {
    const { getByText } = render(<Registration />);

    const backButton = getByText("← Back to Login");
    fireEvent.press(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("Login");
  });

  test("shows password validation error", async () => {
    const { getByText, getAllByRole } = render(<Registration />);

    // Fill all inputs except we'll use short password
    const inputs = getAllByRole("text");
    // Fill fields with test data
    inputs.forEach((input, i) => {
      const values = [
        "ELECT001",
        "Test User",
        "test@test.com",
        "12345",
        "12345",
        "123 Main St",
      ];
      if (i < values.length) {
        fireEvent.changeText(input, values[i]);
      }
    });

    fireEvent.press(getByText("Create Account"));

    await waitFor(() => {
      const calls = Alert.alert.mock.calls;
      const hasError = calls.some(([title]) => title === "Error");
      expect(hasError).toBeTruthy();
    });
  });
});
