import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Dashboard from "@/screens/Dashboard";

vi.mock("axios");
vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    setMapData: vi.fn(),
    setPartiesData: vi.fn(),
    provinces: ["Luanda", "Benguela"],
    topVotesPerProvinces: [
      { id: 1, province: "Luanda", percentage: 55, number: "150K" },
    ],
    setTopVotesPerProvinces: vi.fn(),
    imageList: { "party.a": "http://example.com/party-a.png" },
  }),
}));
vi.mock("@/geomap/GoogleMap", () => ({ default: () => <div>Map</div> }));
vi.mock("@/components/dashboard-components/vertical-bar", () => ({ default: () => <div>Bar</div> }));
vi.mock("@/components/dashboard-components/line-chart", () => ({ default: () => <div>Line</div> }));
vi.mock("@mui/joy/CircularProgress", () => ({
  default: ({ children }: any) => <div data-testid="progress">{children}</div>,
}));
vi.mock("@mui/material/LinearProgress", () => ({ default: () => <div /> }));
vi.mock("@mui/material/Stack", () => ({ default: ({ children }: any) => <div>{children}</div> }));
vi.mock("@mui/material/styles", () => ({
  createTheme: () => ({}),
  ThemeProvider: ({ children }: any) => <>{children}</>,
}));

const mockData = {
  candidatesResult: [
    {
      numVotes: 500,
      percentage: 60.0,
      candidate: { code: 1, name: "John Doe", party: "Party A", acronym: "PA", status: "active", toast: vi.fn() },
    },
  ],
  expectedTotalVotes: 1000,
  totalVotesReceived: 500,
  totalCandidates: 1,
  votesPerProvince: { Luanda: { sum: 300 }, Benguela: { sum: 200 } },
  startTime: 0,
  endTime: 100,
  winner: { code: 1, name: "John Doe", party: "Party A", acronym: "PA", status: "active", toast: vi.fn() },
  averageTimePerVote: 2.5,
  averageVotePerProvince: 250,
  votesPerDay: {},
  votesPerParty: {},
};

function wrap(ui: React.ReactElement) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}><MemoryRouter>{ui}</MemoryRouter></QueryClientProvider>
  );
}

describe("Dashboard Component", () => {
  beforeEach(() => {
    (axios.get as any) = vi.fn().mockResolvedValue({ data: mockData });
  });

  it("renders Votes Received section", async () => {
    wrap(<Dashboard />);
    await waitFor(() => expect(screen.getByText(/Votes Received/i)).toBeInTheDocument());
  });

  it("renders Total Voters and Candidates", async () => {
    wrap(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText(/Total Voters/i)).toBeInTheDocument();
      expect(screen.getByText(/Candidates/i)).toBeInTheDocument();
    });
  });

  it("renders Top Parties section", async () => {
    wrap(<Dashboard />);
    await waitFor(() => expect(screen.getByText(/Top Parties/i)).toBeInTheDocument());
  });

  it("renders Top Provinces section", async () => {
    wrap(<Dashboard />);
    await waitFor(() => expect(screen.getByText(/Top Provinces/i)).toBeInTheDocument());
  });

  it("renders Avg Time section", async () => {
    wrap(<Dashboard />);
    await waitFor(() => expect(screen.getByText(/Avg Time/i)).toBeInTheDocument());
  });

  it("renders Statistics section", async () => {
    wrap(<Dashboard />);
    await waitFor(() => expect(screen.getByText(/Statistics by Province/i)).toBeInTheDocument());
  });

  it("renders Daily Vote Increment section", async () => {
    wrap(<Dashboard />);
    await waitFor(() => expect(screen.getByText(/Daily Vote Increment/i)).toBeInTheDocument());
  });

  it("renders Coverage Region", async () => {
    wrap(<Dashboard />);
    await waitFor(() => expect(screen.getByText(/Coverage Region/i)).toBeInTheDocument());
  });
});
