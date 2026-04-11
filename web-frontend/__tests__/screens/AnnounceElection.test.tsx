import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AnnounceElection from "@/screens/AnnounceElection";

const toastMock = vi.fn();

vi.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: toastMock }),
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ authState: { authenticated: true, name: "Test User" } }),
}));

vi.mock("@/components/ui/calendar", () => ({
  Calendar: ({ onSelect }: any) => (
    <div data-testid="calendar">
      <button
        onClick={() =>
          onSelect({ from: new Date("2027-01-01"), to: new Date("2027-01-15") })
        }
      >
        Select Range
      </button>
    </div>
  ),
}));

describe("AnnounceElection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form card", () => {
    render(
      <MemoryRouter>
        <AnnounceElection />
      </MemoryRouter>,
    );
    expect(screen.getByText("Announce Election")).toBeInTheDocument();
    expect(
      screen.getByText("Create a new election announcement"),
    ).toBeInTheDocument();
  });

  it("renders Title input", () => {
    render(
      <MemoryRouter>
        <AnnounceElection />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
  });

  it("renders Description textarea", () => {
    render(
      <MemoryRouter>
        <AnnounceElection />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(
      <MemoryRouter>
        <AnnounceElection />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("button", { name: /Announce Election/i }),
    ).toBeInTheDocument();
  });

  it("allows typing in Title field", () => {
    render(
      <MemoryRouter>
        <AnnounceElection />
      </MemoryRouter>,
    );
    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, {
      target: { value: "Presidential Election 2027" },
    });
    expect(titleInput).toHaveValue("Presidential Election 2027");
  });

  it("allows typing in Description field", () => {
    render(
      <MemoryRouter>
        <AnnounceElection />
      </MemoryRouter>,
    );
    const descInput = screen.getByLabelText(/Description/i);
    fireEvent.change(descInput, {
      target: { value: "Annual presidential election" },
    });
    expect(descInput).toHaveValue("Annual presidential election");
  });

  it("shows error toast when submitting empty form", async () => {
    render(
      <MemoryRouter>
        <AnnounceElection />
      </MemoryRouter>,
    );
    const submitBtn = screen.getByRole("button", {
      name: /Announce Election/i,
    });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" }),
      );
    });
  });

  it("shows success toast when form is complete", async () => {
    render(
      <MemoryRouter>
        <AnnounceElection />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "Presidential Election 2027" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "The 2027 presidential election announcement" },
    });

    // Select date range via the mocked calendar
    fireEvent.click(screen.getByText("Select Range"));
    fireEvent.click(screen.getByRole("button", { name: /Announce Election/i }));

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Success" }),
      );
    });
  });

  it("resets form after successful submission", async () => {
    render(
      <MemoryRouter>
        <AnnounceElection />
      </MemoryRouter>,
    );

    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: "Test Election" } });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "Test description for the election" },
    });
    fireEvent.click(screen.getByText("Select Range"));
    fireEvent.click(screen.getByRole("button", { name: /Announce Election/i }));

    await waitFor(() => {
      expect(titleInput).toHaveValue("");
    });
  });

  it("renders the Voting Period label", () => {
    render(
      <MemoryRouter>
        <AnnounceElection />
      </MemoryRouter>,
    );
    expect(screen.getByText("Voting Period")).toBeInTheDocument();
  });

  it("renders the calendar for date selection", () => {
    render(
      <MemoryRouter>
        <AnnounceElection />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("calendar")).toBeInTheDocument();
  });
});
