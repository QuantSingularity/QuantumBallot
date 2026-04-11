import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider } from "@/context/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";

vi.mock("@/services/firebase", () => ({
  loadImages: vi.fn(),
}));
vi.mock("@/context/SecureStore", () => ({
  getItemAsync: vi.fn().mockResolvedValue(null),
  setItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
}));
vi.mock("@/global/globalVariables", () => ({
  TOKEN_KEY: "jwt",
  REFRESH_TOKEN_KEY: "refresh",
  TOKEN_USERNAME: "username",
  TOKEN_NAME: "name",
  TOKEN_ROLE: "role",
  GLOBAL_VARIABLES: { LOCALHOST: "localhost:3010" },
}));
vi.mock("axios");

const TestApp = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </MemoryRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};

describe("App Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the provider tree without errors", () => {
    render(
      <TestApp>
        <div data-testid="app-content">App Content</div>
      </TestApp>
    );
    expect(screen.getByTestId("app-content")).toBeInTheDocument();
  });

  it("ErrorBoundary wraps the app correctly", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const CrashingComponent = () => { throw new Error("Test crash"); };
    render(
      <TestApp>
        <CrashingComponent />
      </TestApp>
    );
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it("AuthProvider renders children", () => {
    const queryClient = new QueryClient();
    render(
      <AuthProvider>
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <span data-testid="nested-child">nested</span>
          </QueryClientProvider>
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.getByTestId("nested-child")).toBeInTheDocument();
  });
});
