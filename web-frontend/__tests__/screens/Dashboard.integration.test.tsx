import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Dashboard from "@/screens/Dashboard";

vi.mock("axios");

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    setMapData: vi.fn(),
    setPartiesData: vi.fn(),
    provinces: ["Province1", "Province2"],
    topVotesPerProvinces: [],
    setTopVotesPerProvinces: vi.fn(),
    imageList: {},
  }),
}));

vi.mock("@/geomap/GoogleMap", () => ({
  default: () => <div data-testid="google-map">Google Map Mock</div>,
}));

vi.mock("@/components/dashboard-components/vertical-bar", () => ({
  default: () => <div data-testid="vertical-bar">Vertical Bar Chart</div>,
}));

vi.mock("@/components/dashboard-components/line-chart", () => ({
  default: () => <div data-testid="line-chart">Line Chart</div>,
}));

vi.mock("@mui/joy/CircularProgress", () => ({
  default: ({ children, value }: any) => (
    <div data-testid="circular-progress" data-value={value}>
      {children}
    </div>
  ),
}));

vi.mock("@mui/material/LinearProgress", () => ({
  default: ({ value }: any) => (
    <div data-testid="linear-progress" data-value={value} />
  ),
}));

vi.mock("@mui/material/Stack", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@mui/material/styles", () => ({
  createTheme: () => ({}),
  ThemeProvider: ({ children }: any) => <>{children}</>,
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

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("Dashboard Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (axios.get as any) = vi.fn().mockResolvedValue({ data: mockResultsData });
  });

  it("renders without crashing", async () => {
    renderWithClient(<Dashboard />);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
  });

  it("calls the results computed API on mount", async () => {
    renderWithClient(<Dashboard />);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/api/blockchain/get-results-computed"),
      );
    });
  });

  it("renders vote received section", async () => {
    renderWithClient(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText(/Votes Received/i)).toBeInTheDocument();
    });
  });

  it("renders top provinces section", async () => {
    renderWithClient(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText(/Top Provinces/i)).toBeInTheDocument();
    });
  });

  it("renders top parties section", async () => {
    renderWithClient(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText(/Top Parties/i)).toBeInTheDocument();
    });
  });

  it("renders chart components", async () => {
    renderWithClient(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
      expect(screen.getByTestId("vertical-bar")).toBeInTheDocument();
    });
  });

  it("renders the map section", async () => {
    renderWithClient(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText(/Coverage Region/i)).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully without crashing", async () => {
    (axios.get as any) = vi.fn().mockRejectedValue(new Error("API Error"));
    renderWithClient(<Dashboard />);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    // Should still render the layout
    expect(screen.getByText(/Votes Received/i)).toBeInTheDocument();
  });

  it("shows statistics section header", async () => {
    renderWithClient(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText(/Statistics by Province/i)).toBeInTheDocument();
    });
  });
});
