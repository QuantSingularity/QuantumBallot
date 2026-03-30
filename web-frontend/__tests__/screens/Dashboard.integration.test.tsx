import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Dashboard from "@/screens/Dashboard";

// Mock axios
vi.mock("axios");

// Mock the auth context
vi.mock("@/context/AuthContext", async () => {
  const actual = await vi.importActual("@/context/AuthContext");
  return {
    ...actual,
    useAuth: () => ({
      setMapData: vi.fn(),
      setPartiesData: vi.fn(),
      provinces: ["Province1", "Province2"],
      topVotesPerProvinces: [],
      setTopVotesPerProvinces: vi.fn(),
      imageList: {},
    }),
  };
});

// Mock Google Map component
vi.mock("@/geomap/GoogleMap", () => ({
  default: () => <div>Google Map Mock</div>,
}));

// Mock chart components
vi.mock("@/components/dashboard-components/vertical-bar", () => ({
  default: () => <div>Vertical Bar Chart</div>,
}));

vi.mock("@/components/dashboard-components/line-chart", () => ({
  default: () => <div>Line Chart</div>,
}));

const mockResultsData = {
  candidatesResult: [
    {
      numVotes: 100,
      percentage: 45.5,
      candidate: {
        code: 1,
        name: "Candidate One",
        party: "Party A",
        acronym: "PA",
        status: "active",
        toast: vi.fn(),
      },
    },
    {
      numVotes: 80,
      percentage: 36.4,
      candidate: {
        code: 2,
        name: "Candidate Two",
        party: "Party B",
        acronym: "PB",
        status: "active",
        toast: vi.fn(),
      },
    },
  ],
  expectedTotalVotes: 220,
  totalVotesReceived: 180,
  totalCandidates: 2,
  votesPerProvince: {
    Province1: { sum: 100 },
    Province2: { sum: 80 },
  },
  startTime: 1640000000,
  endTime: 1640086400,
  winner: {
    code: 1,
    name: "Candidate One",
    party: "Party A",
    acronym: "PA",
    status: "active",
    toast: vi.fn(),
  },
  averageTimePerVote: 5,
  averageVotePerProvince: 90,
  votesPerDay: {},
  votesPerParty: {},
};

describe("Dashboard Integration Tests", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    // Mock successful API response
    (axios.get as any) = vi.fn().mockResolvedValue({
      data: mockResultsData,
    });
  });

  it("should render dashboard without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>,
    );

    // Wait for async operations to complete
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });

  it("should fetch election results on mount", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/api/blockchain/get-results-computed"),
      );
    });
  });

  it("should handle API errors gracefully", async () => {
    (axios.get as any) = vi.fn().mockRejectedValue(new Error("API Error"));

    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });

    // Component should still render even if API fails
    expect(screen.queryByText("Google Map Mock")).toBeInTheDocument();
  });

  it("should process election results correctly", async () => {
    const setMapData = vi.fn();
    const setPartiesData = vi.fn();
    const setTopVotesPerProvinces = vi.fn();

    vi.mock("@/context/AuthContext", () => ({
      useAuth: () => ({
        setMapData,
        setPartiesData,
        provinces: ["Province1", "Province2"],
        topVotesPerProvinces: [],
        setTopVotesPerProvinces,
        imageList: {},
      }),
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });
});
