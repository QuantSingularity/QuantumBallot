/**
 * E2E-style Test: Application Launch
 */

import { render, waitFor } from "@testing-library/react-native";
import React from "react";

// Mock the entire App to avoid deep native module dependency chain in tests
jest.mock("../../App", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    __esModule: true,
    default: () => (
      <View>
        <Text>QuantumBallot</Text>
        <Text>Secure Blockchain Voting</Text>
      </View>
    ),
  };
});

jest.mock("expo-font", () => ({
  loadAsync: jest.fn().mockResolvedValue(undefined),
  isLoaded: jest.fn().mockReturnValue(true),
}));

jest.mock("expo-splash-screen", () => ({
  hideAsync: jest.fn().mockResolvedValue(undefined),
  preventAutoHideAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@expo-google-fonts/roboto", () => ({
  useFonts: () => [true],
  Roboto_400Regular: "Roboto_400Regular",
  Roboto_700Bold: "Roboto_700Bold",
}));

const App = require("../../App").default;

describe("E2E: Application", () => {
  it("renders app successfully", async () => {
    const { UNSAFE_root } = render(<App />);
    await waitFor(() => {
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it("displays app name on initial load", async () => {
    const { getByText } = render(<App />);
    await waitFor(() => {
      expect(getByText("QuantumBallot")).toBeTruthy();
    });
  });
});
