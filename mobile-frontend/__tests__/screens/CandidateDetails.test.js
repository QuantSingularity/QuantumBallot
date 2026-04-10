/**
 * Tests for CandidateDetails screen
 */

import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { CandidateDetails } from "src/screens/CandidateDetails";

const mockGoBack = jest.fn();
const mockNavigation = { navigate: jest.fn(), goBack: mockGoBack };
const mockRoute = {
  params: {
    id: "1",
    name: "Alice Johnson",
    party: "Progressive Party",
    acronym: "PP",
    photo: "https://example.com/alice.jpg",
    src: "https://example.com/pp.jpg",
  },
};

describe("CandidateDetails Screen", () => {
  beforeEach(() => {
    mockGoBack.mockClear();
    mockNavigation.navigate.mockClear();
  });

  test("renders candidate name and party", () => {
    const { getByText } = render(
      <CandidateDetails navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByText("Alice Johnson")).toBeTruthy();
    expect(getByText("Progressive Party")).toBeTruthy();
  });

  test("renders back button and navigates on press", () => {
    const { getByText } = render(
      <CandidateDetails navigation={mockNavigation} route={mockRoute} />,
    );
    const backBtn = getByText("Back");
    fireEvent.press(backBtn);
    expect(mockGoBack).toHaveBeenCalled();
  });

  test("handles missing params gracefully", () => {
    const { getByText } = render(
      <CandidateDetails navigation={mockNavigation} route={{ params: {} }} />,
    );
    expect(getByText("Unknown")).toBeTruthy();
  });

  test("shows acronym when provided", () => {
    const { getByText } = render(
      <CandidateDetails navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByText("PP")).toBeTruthy();
  });
});
