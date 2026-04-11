import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Blockchain from "@/screens/Blockchain";

vi.mock("axios");
vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ authState: { authenticated: true } }),
}));
vi.mock("@/components/blockchain-list/BlockList", () => ({
  default: () => <div data-testid="block-list">Block List</div>,
}));
vi.mock("@/tables/blocks_table/page", () => ({
  default: () => <div data-testid="blocks-table">Blocks Table</div>,
}));
vi.mock("@/tables/blocks_table/LineChartCustomized", () => ({
  default: () => <div data-testid="line-chart">Line Chart</div>,
}));
vi.mock("@/tables/transactions_table/page", () => ({
  default: () => <div data-testid="transactions-table">Transactions Table</div>,
}));
vi.mock("@/tables/pending_transactions_table/page", () => ({
  default: () => <div data-testid="pending-transactions-table">Pending Transactions</div>,
}));
vi.mock("@/components/ui/toaster", () => ({
  Toaster: () => <div data-testid="toaster" />,
}));
vi.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe("Blockchain Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Blockchain heading", () => {
    renderWithClient(<Blockchain />);
    expect(screen.getByText("Blockchain")).toBeInTheDocument();
  });

  it("renders BlockList component", () => {
    renderWithClient(<Blockchain />);
    expect(screen.getByTestId("block-list")).toBeInTheDocument();
  });

  it("renders Blocks table", () => {
    renderWithClient(<Blockchain />);
    expect(screen.getByTestId("blocks-table")).toBeInTheDocument();
  });

  it("renders Transactions table", () => {
    renderWithClient(<Blockchain />);
    expect(screen.getByTestId("transactions-table")).toBeInTheDocument();
  });

  it("renders Pending Transactions section", () => {
    renderWithClient(<Blockchain />);
    expect(screen.getByTestId("pending-transactions-table")).toBeInTheDocument();
  });

  it("renders Mine Block button", () => {
    renderWithClient(<Blockchain />);
    expect(screen.getByRole("button", { name: /Mine Block/i })).toBeInTheDocument();
  });

  it("renders the range input field", () => {
    renderWithClient(<Blockchain />);
    const input = screen.getByDisplayValue("3010-3010");
    expect(input).toBeInTheDocument();
  });

  it("updates range input on change", () => {
    renderWithClient(<Blockchain />);
    const input = screen.getByDisplayValue("3010-3010");
    fireEvent.change(input, { target: { value: "3010-3015" } });
    expect(input).toHaveValue("3010-3015");
  });

  it("Mine Block button is clickable", () => {
    renderWithClient(<Blockchain />);
    const mineBtn = screen.getByRole("button", { name: /Mine Block/i });
    expect(() => fireEvent.click(mineBtn)).not.toThrow();
  });

  it("renders Block time chart", () => {
    renderWithClient(<Blockchain />);
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });
});
