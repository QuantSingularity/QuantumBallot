/**
 * Tests for ThankVote screen
 */

import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import ThankVote from "src/screens/ThankVote";

const mockNavigate = jest.fn();
const mockReset = jest.fn();

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({ navigate: mockNavigate, reset: mockReset }),
  useRoute: () => ({
    params: { data: "0xabc123def456", transactionHash: "0xabc123def456" },
  }),
}));

jest.mock("expo-clipboard", () => ({
  setStringAsync: jest.fn().mockResolvedValue(undefined),
}));

describe("ThankVote Screen", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockReset.mockClear();
  });

  test("renders thank you message correctly", () => {
    const { getByText } = render(<ThankVote />);

    expect(getByText("Thank You for Voting!")).toBeTruthy();
    expect(getByText("Your vote has been securely recorded.")).toBeTruthy();
    expect(getByText("Return to Home")).toBeTruthy();
  });

  test("displays transaction id from route params", () => {
    const { getByText } = render(<ThankVote />);
    expect(getByText("0xabc123def456")).toBeTruthy();
  });

  test("navigates to home screen when button is pressed", async () => {
    const { getByText } = render(<ThankVote />);

    const homeButton = getByText("Return to Home");
    fireEvent.press(homeButton);

    await waitFor(() => {
      expect(mockReset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: "Menu" }],
      });
    });
  });

  test("renders confetti animation container", () => {
    const { getByTestId } = render(<ThankVote />);
    expect(getByTestId("confetti-animation")).toBeTruthy();
  });

  test("handles automatic navigation after timeout", async () => {
    jest.useFakeTimers();

    render(<ThankVote />);

    jest.advanceTimersByTime(10001);

    await waitFor(() => {
      expect(mockReset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: "Menu" }],
      });
    });

    jest.useRealTimers();
  });

  test("copies transaction id to clipboard", async () => {
    const { Clipboard } = require("expo-clipboard");
    const { getByText } = render(<ThankVote />);

    const copyButton = getByText("Copy");
    fireEvent.press(copyButton);

    await waitFor(() => {
      expect(require("expo-clipboard").setStringAsync).toHaveBeenCalledWith(
        "0xabc123def456",
      );
    });
  });
});
