import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ authState: { authenticated: true, name: "Test User" } }),
}));

vi.mock("@/components/toast/toaster", () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

vi.mock("@/components/toast/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

vi.mock("@/tables/voters_table/page", () => ({
  default: ({ toast }: any) => (
    <div data-testid="voters-table">
      Voters Table {toast ? "with-toast" : ""}
    </div>
  ),
}));

import Voters from "@/screens/Voters";

describe("Voters Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Voters heading", () => {
    render(
      <MemoryRouter>
        <Voters />
      </MemoryRouter>,
    );
    expect(screen.getByText("Voters")).toBeInTheDocument();
  });

  it("renders the voters table", () => {
    render(
      <MemoryRouter>
        <Voters />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("voters-table")).toBeInTheDocument();
  });

  it("renders toaster", () => {
    render(
      <MemoryRouter>
        <Voters />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("toaster")).toBeInTheDocument();
  });

  it("passes toast to table", () => {
    render(
      <MemoryRouter>
        <Voters />
      </MemoryRouter>,
    );
    expect(screen.getByText(/with-toast/)).toBeInTheDocument();
  });
});
