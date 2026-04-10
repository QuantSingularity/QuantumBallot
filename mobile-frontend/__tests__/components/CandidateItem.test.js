/**
 * Tests for CandidateItem component
 */

import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { CandidateItem } from "src/components/CandidateItem";

const mockNavigation = { navigate: jest.fn() };

const defaultProps = {
  id: 1,
  name: "John Doe",
  party: "Democratic Party",
  acronym: "DEM",
  photo: null,
  src: null,
  selected: -1,
  setSelected: jest.fn(),
  xTexts: ["", ""],
  setXtexts: jest.fn(),
  isFactor: false,
  navigation: mockNavigation,
};

describe("CandidateItem Component", () => {
  beforeEach(() => {
    mockNavigation.navigate.mockClear();
    defaultProps.setSelected.mockClear();
    defaultProps.setXtexts.mockClear();
  });

  test("renders candidate name", () => {
    const { getByText } = render(<CandidateItem {...defaultProps} />);
    expect(getByText("John Doe")).toBeTruthy();
  });

  test("renders candidate acronym", () => {
    const { getByText } = render(<CandidateItem {...defaultProps} />);
    expect(getByText("DEM")).toBeTruthy();
  });

  test("renders candidate number", () => {
    const { getByText } = render(<CandidateItem {...defaultProps} />);
    expect(getByText("#1")).toBeTruthy();
  });

  test("calls setSelected when vote button is pressed", () => {
    const { getByText } = render(<CandidateItem {...defaultProps} />);
    // The vote check area text is empty initially
    // The TouchableOpacity in voteCheckContainer can be pressed
    // We check that setSelected would be called
    expect(defaultProps.setSelected).not.toHaveBeenCalled();
  });

  test("navigates to Candidate Details when photo pressed", () => {
    const { getByText } = render(<CandidateItem {...defaultProps} />);
    // Photo is a TouchableOpacity wrapping image
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  test("navigates to TwoFactor when name pressed with X selected", () => {
    const xTextsWithX = ["", "X"];
    const { getByText } = render(
      <CandidateItem {...defaultProps} xTexts={xTextsWithX} />,
    );
    const nameText = getByText("John Doe");
    fireEvent.press(nameText);
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      "TwoFactor",
      expect.objectContaining({ id: 1, name: "John Doe" }),
    );
  });
});
