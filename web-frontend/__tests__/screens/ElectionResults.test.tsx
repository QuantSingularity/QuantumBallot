import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import ElectionResults from "@/screens/ElectionResults";

vi.mock("axios");
vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ authState: { authenticated: true } }),
}));
vi.mock("@/tables/election_results_table/page", () => ({
  default: ({ data }: any) => (
    <div data-testid="election-results-table">{data?.length ?? 0} results</div>
  ),
}));

const mockResults = {
  candidatesResult: [
    {
      numVotes: 1250,
      percentage: 45.5,
      candidate: { name: "Alice Johnson", party: "Progressive", acronym: "PG" },
    },
    {
      numVotes: 980,
      percentage: 35.6,
      candidate: { name: "Bob Smith", party: "Conservative", acronym: "CV" },
    },
    {
      numVotes: 520,
      percentage: 18.9,
      candidate: { name: "Carol White", party: "Independent", acronym: "IN" },
    },
  ],
  totalVotesReceived: 2750,
};

describe("ElectionResults Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the title", () => {
    (axios.get as any) = vi.fn().mockResolvedValue({ data: mockResults });
    render(
      <MemoryRouter>
        <ElectionResults />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Election Results/i)).toBeInTheDocument();
  });

  it("shows loading spinner initially", () => {
    (axios.get as any) = vi.fn().mockReturnValue(new Promise(() => {}));
    render(
      <MemoryRouter>
        <ElectionResults />
      </MemoryRouter>,
    );
    // Loading spinners are rendered (animate-spin class)
    const spinners = document.querySelectorAll(".animate-spin");
    expect(spinners.length).toBeGreaterThan(0);
  });

  it("renders results table after data loads", async () => {
    (axios.get as any) = vi.fn().mockResolvedValue({ data: mockResults });
    render(
      <MemoryRouter>
        <ElectionResults />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("election-results-table")).toBeInTheDocument();
    });
  });

  it("displays total votes summary", async () => {
    (axios.get as any) = vi.fn().mockResolvedValue({ data: mockResults });
    render(
      <MemoryRouter>
        <ElectionResults />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText("2,750")).toBeInTheDocument();
    });
  });

  it("displays the current leader", async () => {
    (axios.get as any) = vi.fn().mockResolvedValue({ data: mockResults });
    render(
      <MemoryRouter>
        <ElectionResults />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText(/Alice Johnson/i)).toBeInTheDocument();
    });
  });

  it("displays candidate count", async () => {
    (axios.get as any) = vi.fn().mockResolvedValue({ data: mockResults });
    render(
      <MemoryRouter>
        <ElectionResults />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  it("renders pie chart when data is available", async () => {
    (axios.get as any) = vi.fn().mockResolvedValue({ data: mockResults });
    render(
      <MemoryRouter>
        <ElectionResults />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText("Vote Distribution")).toBeInTheDocument();
    });
  });

  it("handles API error gracefully", async () => {
    (axios.get as any) = vi.fn().mockRejectedValue(new Error("Network error"));
    render(
      <MemoryRouter>
        <ElectionResults />
      </MemoryRouter>,
    );
    await waitFor(() => {
      // Should show empty state, not crash
      expect(screen.getByText(/Election Results/i)).toBeInTheDocument();
    });
  });

  it("renders the Refresh button", () => {
    (axios.get as any) = vi.fn().mockResolvedValue({ data: mockResults });
    render(
      <MemoryRouter>
        <ElectionResults />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("button", { name: /Refresh/i }),
    ).toBeInTheDocument();
  });

  it("shows Election Summary section", async () => {
    (axios.get as any) = vi.fn().mockResolvedValue({ data: mockResults });
    render(
      <MemoryRouter>
        <ElectionResults />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText("Election Summary")).toBeInTheDocument();
    });
  });
});
