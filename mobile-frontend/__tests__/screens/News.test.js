/**
 * Tests for News screen
 */

import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { News } from "src/screens/News";

describe("News Screen", () => {
  test("renders news header", async () => {
    const { getByText } = render(<News />);
    await waitFor(() => {
      expect(getByText("Election News")).toBeTruthy();
    });
  });

  test("renders news articles after loading", async () => {
    const { getByText } = render(<News />);
    await waitFor(() => {
      expect(getByText("Presidential Debate Highlights")).toBeTruthy();
    });
  });

  test("read more button expands article content", async () => {
    const { getAllByText, getByText } = render(<News />);
    await waitFor(() => {
      expect(getByText("Presidential Debate Highlights")).toBeTruthy();
    });

    const readMoreButtons = getAllByText("Read more");
    expect(readMoreButtons.length).toBeGreaterThan(0);
    fireEvent.press(readMoreButtons[0]);

    await waitFor(() => {
      expect(getAllByText("Show less").length).toBeGreaterThan(0);
    });
  });

  test("renders multiple news articles", async () => {
    const { getByText } = render(<News />);
    await waitFor(() => {
      expect(getByText("Voter Registration Deadline Approaching")).toBeTruthy();
      expect(getByText("New Polling Locations Announced")).toBeTruthy();
    });
  });
});
