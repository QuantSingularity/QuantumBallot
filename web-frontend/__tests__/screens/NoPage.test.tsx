import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import NoPage from "@/screens/NoPage";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

describe("NoPage Component", () => {
  it("renders 404 heading", () => {
    render(
      <MemoryRouter>
        <NoPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders Page Not Found message", () => {
    render(
      <MemoryRouter>
        <NoPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
  });

  it("renders descriptive message", () => {
    render(
      <MemoryRouter>
        <NoPage />
      </MemoryRouter>,
    );
    expect(
      screen.getByText(/doesn't exist or has been moved/i),
    ).toBeInTheDocument();
  });

  it("renders a back to dashboard button", () => {
    render(
      <MemoryRouter>
        <NoPage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Back to Dashboard/i)).toBeInTheDocument();
  });

  it("navigates to dashboard on button click", () => {
    render(
      <MemoryRouter>
        <NoPage />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText(/Back to Dashboard/i));
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
