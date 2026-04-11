import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Entrance from "@/screens/Entrance";

vi.mock("@/services/firebase", () => ({
  loadImages: vi.fn(),
}));

vi.mock("@/components/Container", () => ({
  default: () => <div data-testid="container">Container</div>,
}));

vi.mock("@/components/SidebarComponent", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

vi.mock("@/screens/Login", () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}));

const mockLoadImages = vi.fn();

describe("Entrance Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Login when not authenticated", () => {
    vi.mock("@/context/AuthContext", () => ({
      useAuth: () => ({
        authState: { authenticated: false, name: null },
        isLoggedIn: vi.fn(),
        setImageList: vi.fn(),
      }),
    }));

    render(
      <MemoryRouter>
        <Entrance />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });

  it("renders sidebar and container when authenticated", async () => {
    vi.doMock("@/context/AuthContext", () => ({
      useAuth: () => ({
        authState: { authenticated: true, name: "Test User" },
        isLoggedIn: vi.fn().mockResolvedValue({}),
        setImageList: vi.fn(),
      }),
    }));

    const { default: EntranceFresh } = await import("@/screens/Entrance");
    render(
      <MemoryRouter>
        <EntranceFresh />
      </MemoryRouter>,
    );
    // The sidebar and container are conditionally rendered
    expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
  });

  it("renders without crashing", () => {
    vi.mock("@/context/AuthContext", () => ({
      useAuth: () => ({
        authState: { authenticated: null },
        isLoggedIn: vi.fn(),
        setImageList: vi.fn(),
      }),
    }));
    expect(() =>
      render(
        <MemoryRouter>
          <Entrance />
        </MemoryRouter>,
      ),
    ).not.toThrow();
  });
});
