/**
 * Tests for Navigation routes
 */

import { render } from "@testing-library/react-native";
import React from "react";
import { AppRoutes } from "src/routes/app.routes";

jest.mock("@react-navigation/stack", () => ({
  createStackNavigator: jest.fn().mockReturnValue({
    Navigator: ({ children }) => <>{children}</>,
    Screen: ({ name }) => null,
  }),
  TransitionPresets: { ScaleFromCenterAndroid: {} },
}));

jest.mock("src/context/AuthContext", () => ({
  AuthProvider: ({ children }) => <>{children}</>,
  useAuth: () => ({
    authState: { authenticated: false },
    onLogOut: jest.fn(),
    isLoggedIn: jest.fn().mockResolvedValue({ success: false }),
    isLoading: false,
    imageList: {},
    setImageList: jest.fn(),
  }),
}));

jest.mock("@components/BottomNavigation", () => ({
  BottomNavigation: () => null,
}));
jest.mock("@components/CameraQR", () => () => null);
jest.mock("@screens/CandidateDetails", () => ({
  CandidateDetails: () => null,
}));
jest.mock("@screens/Login", () => ({ Login: () => null }));
jest.mock("@screens/Registration", () => ({ Registration: () => null }));
jest.mock("@screens/ThankVote", () => ({ default: () => null }));
jest.mock("@screens/TwoFactor", () => ({
  TwoFactor: () => null,
  default: () => null,
}));

describe("AppRoutes Navigation", () => {
  test("renders without crashing", () => {
    expect(() => render(<AppRoutes />)).not.toThrow();
  });

  test("AppRoutes is a function component", () => {
    expect(typeof AppRoutes).toBe("function");
  });
});
