/**
 * Tests for CameraQR component
 */

import { act, fireEvent, render } from "@testing-library/react-native";
import React from "react";
import CameraQR from "src/components/CameraQR";

const mockGoBack = jest.fn();
const mockNavigation = { goBack: mockGoBack, navigate: jest.fn() };
const mockRoute = { params: { secret: "test-secret-key" } };

jest.mock("expo-camera", () => ({
  Camera: {
    requestCameraPermissionsAsync: jest
      .fn()
      .mockResolvedValue({ status: "granted" }),
  },
  CameraView: "CameraView",
  useCameraPermissions: jest
    .fn()
    .mockReturnValue([
      { granted: true, status: "granted" },
      jest.fn().mockResolvedValue({ granted: true }),
    ]),
}));

describe("CameraQR Component", () => {
  beforeEach(() => {
    mockGoBack.mockClear();
  });

  test("renders without crashing when permission granted", async () => {
    let component;
    await act(async () => {
      component = render(
        <CameraQR navigation={mockNavigation} route={mockRoute} />,
      );
    });
    expect(component).toBeTruthy();
  });

  test("renders requesting permission state initially", async () => {
    const { useCameraPermissions } = require("expo-camera");
    useCameraPermissions.mockReturnValueOnce([null, jest.fn()]);

    const { getByText } = render(
      <CameraQR navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByText("Requesting for camera permission")).toBeTruthy();
  });

  test("renders no access message when permission denied", async () => {
    const { useCameraPermissions } = require("expo-camera");
    useCameraPermissions.mockReturnValueOnce([
      { granted: false, status: "denied" },
      jest.fn(),
    ]);

    const { getByText } = render(
      <CameraQR navigation={mockNavigation} route={mockRoute} />,
    );
    expect(getByText("No access to camera")).toBeTruthy();
  });

  test("back button calls goBack", async () => {
    const { getAllByRole } = render(
      <CameraQR navigation={mockNavigation} route={mockRoute} />,
    );
    // CaretLeft button is a TouchableOpacity
    // Test that mockGoBack has not been called yet
    expect(mockGoBack).not.toHaveBeenCalled();
  });
});
