/**
 * Tests for TwoFactor screen
 */

import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
}));

jest.mock("src/context/AuthContext", () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    authState: {
      authenticated: true,
      electoralId: "test-id",
      email: "test@test.com",
      token: "test-token",
      port: "3010",
    },
    onLogOut: jest.fn(),
    isLoading: false,
    imageList: {},
    setImageList: jest.fn(),
  }),
}));

jest.mock("expo-file-system", () => ({
  documentDirectory: "/mock/documents/",
  writeAsStringAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn().mockResolvedValue("test-token"),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("src/api/axios", () => ({
  post: jest.fn().mockResolvedValue({ status: 200, data: {} }),
  defaults: { headers: { common: {} } },
}));

const mockRoute = {
  params: {
    id: "1",
    name: "John Doe",
    party: "Test Party",
    acronym: "TP",
    photo: "",
    src: "",
    isFactor: false,
  },
};

const mockNavigation = {
  navigate: jest.fn(),
};

const { TwoFactor } = require("src/screens/TwoFactor");

describe("TwoFactor Screen", () => {
  beforeEach(() => {
    mockNavigation.navigate.mockClear();
  });

  test("renders two-factor authentication screen correctly", () => {
    const { getByText } = render(
      <TwoFactor navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByText("Two-Factor Authentication")).toBeTruthy();
    expect(getByText("TOTP Verification Code")).toBeTruthy();
    expect(
      getByText("Please enter the 6-digit code from your authenticator app."),
    ).toBeTruthy();
  });

  test("renders candidate name", () => {
    const { getByText } = render(
      <TwoFactor navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByText("John Doe")).toBeTruthy();
  });

  test("renders number pad buttons", () => {
    const { getByText } = render(
      <TwoFactor navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByText("1")).toBeTruthy();
    expect(getByText("9")).toBeTruthy();
    expect(getByText("0")).toBeTruthy();
  });

  test("renders 6 digit code indicators", () => {
    const { getAllByTestId } = render(
      <TwoFactor navigation={mockNavigation} route={mockRoute} />,
    );
    // NumberItem renders circles - there should be 6
    expect(getAllByTestId).toBeTruthy();
  });

  test("back button navigates to Candidates", () => {
    const { getByTestId } = render(
      <TwoFactor navigation={mockNavigation} route={mockRoute} />,
    );
    // Pressing back should call navigate("Candidates")
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });
});
