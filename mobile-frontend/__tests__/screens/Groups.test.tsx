import { useNavigation } from "@react-navigation/native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import axios from "../../src/api/axios";
import { useAuth } from "../../src/context/AuthContext";
import { Groups } from "../../src/screens/Groups";

// Mock dependencies
jest.mock("../../src/api/axios");
jest.mock("../../src/context/AuthContext");
jest.mock("@react-navigation/native");
jest.spyOn(Alert, "alert");

const mockAxios = axios as jest.Mocked<typeof axios>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseNavigation = useNavigation as jest.MockedFunction<
  typeof useNavigation
>;

describe("Groups Screen", () => {
  const mockNavigate = jest.fn();
  const mockAuthState = {
    token: "test-token",
    authenticated: true,
    email: "test@example.com",
    electoralId: "TEST123",
    port: "3010",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      authState: mockAuthState,
      isLoading: false,
      imageList: {},
      setImageList: jest.fn(),
    });
    mockUseNavigation.mockReturnValue({
      navigate: mockNavigate,
    } as any);
  });

  it("renders loading state initially", () => {
    mockAxios.get.mockImplementation(() => new Promise(() => {}));

    const { getByText } = render(<Groups />);
    expect(getByText("Loading candidates...")).toBeTruthy();
  });

  it("loads and displays candidates", async () => {
    const mockCandidates = [
      { code: 1, name: "John Doe", party: "Democratic Party", acronym: "DEM" },
      {
        code: 2,
        name: "Jane Smith",
        party: "Republican Party",
        acronym: "REP",
      },
    ];

    mockAxios.get.mockResolvedValue({
      status: 200,
      data: {
        candidates: mockCandidates,
        note: "Success",
      },
    });

    const { getByText, queryByText } = render(<Groups />);

    await waitFor(() => {
      expect(queryByText("Loading candidates...")).toBeNull();
    });

    expect(getByText("Cast Your Vote")).toBeTruthy();
    expect(getByText("John Doe")).toBeTruthy();
    expect(getByText("Jane Smith")).toBeTruthy();
  });

  it("displays error when candidates fail to load", async () => {
    mockAxios.get.mockRejectedValue(new Error("Network error"));

    const { queryByText } = render(<Groups />);

    await waitFor(() => {
      expect(queryByText("Loading candidates...")).toBeNull();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Error",
      "Failed to load candidates. Please try again later.",
    );
  });

  it("allows selecting a candidate", async () => {
    const mockCandidates = [
      { code: 1, name: "John Doe", party: "Democratic Party" },
    ];

    mockAxios.get.mockResolvedValue({
      status: 200,
      data: { candidates: mockCandidates },
    });

    const { getByText } = render(<Groups />);

    await waitFor(() => {
      expect(getByText("John Doe")).toBeTruthy();
    });

    const candidateCard = getByText("John Doe").parent?.parent?.parent;
    if (candidateCard) {
      fireEvent.press(candidateCard);
    }

    await waitFor(() => {
      expect(getByText("Submit Vote")).toBeTruthy();
    });
  });

  it("shows confirmation dialog when submitting vote", async () => {
    const mockCandidates = [
      { code: 1, name: "John Doe", party: "Democratic Party" },
    ];

    mockAxios.get.mockResolvedValue({
      status: 200,
      data: { candidates: mockCandidates },
    });

    const { getByText } = render(<Groups />);

    await waitFor(() => {
      expect(getByText("John Doe")).toBeTruthy();
    });

    // Select candidate
    const candidateCard = getByText("John Doe").parent?.parent?.parent;
    if (candidateCard) {
      fireEvent.press(candidateCard);
    }

    // Click submit
    const submitButton = getByText("Submit Vote");
    fireEvent.press(submitButton);

    expect(Alert.alert).toHaveBeenCalled();
  });

  it("displays message when no candidates are available", async () => {
    mockAxios.get.mockResolvedValue({
      status: 200,
      data: { candidates: [] },
    });

    const { getByText } = render(<Groups />);

    await waitFor(() => {
      expect(getByText("No candidates available at this time.")).toBeTruthy();
    });
  });

  it("shows voting not available message when outside voting period", async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    mockAxios.get.mockImplementation((url) => {
      if (url.includes("announcement")) {
        return Promise.resolve({
          status: 200,
          data: {
            announcement: {
              startTimeVoting: pastDate.toISOString(),
              endTimeVoting: pastDate.toISOString(),
            },
          },
        });
      }
      return Promise.resolve({
        status: 200,
        data: { candidates: [] },
      });
    });

    const { getByText } = render(<Groups />);

    await waitFor(() => {
      expect(getByText("Voting Not Available")).toBeTruthy();
    });
  });
});
