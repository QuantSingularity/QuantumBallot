import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "@/screens/Home";

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ authState: { authenticated: true, name: "Test User" } }),
}));

describe("Home Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the main heading", () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    expect(screen.getByText(/Blockchain Voting System/i)).toBeInTheDocument();
  });

  it("renders all three feature cards", () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    expect(screen.getByText("Secure Voting")).toBeInTheDocument();
    expect(screen.getByText("Transparent Process")).toBeInTheDocument();
    expect(screen.getByText("Real-time Results")).toBeInTheDocument();
  });

  it("renders the description text", () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    expect(screen.getByText(/secure, transparent, and efficient/i)).toBeInTheDocument();
  });

  it("renders election action cards", () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    expect(screen.getByText("Current Election")).toBeInTheDocument();
    expect(screen.getByText("Election Results")).toBeInTheDocument();
  });

  it("renders navigation buttons", () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    expect(screen.getByRole("button", { name: /View Candidates/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /View Results/i })).toBeInTheDocument();
  });

  it("navigation buttons are clickable", () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    const viewCandidatesBtn = screen.getByRole("button", { name: /View Candidates/i });
    expect(() => fireEvent.click(viewCandidatesBtn)).not.toThrow();
  });
});
