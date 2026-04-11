import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ authState: { authenticated: true } }),
}));
vi.mock("@/components/blockchain-list/BlockList", () => ({
  default: () => <div data-testid="block-list">Block List</div>,
}));
vi.mock("@/components/json-editor/JsonEditor", () => ({
  default: () => <div data-testid="json-editor">JSON Editor</div>,
}));
vi.mock("@/components/json-editor/EditorRaw", () => ({
  default: () => <div data-testid="editor-raw">Raw Editor</div>,
}));
vi.mock("@/components/ui/block-copy-button", () => ({
  BlockCopyButton: () => <button>Copy</button>,
}));
vi.mock("@/tables/transactions_block_details/page", () => ({
  default: () => <div data-testid="tx-table">Transactions</div>,
}));

const mockBlockData = {
  blockHeader: {
    version: "1.0",
    blockHash: "abc123def456",
    previousBlockHash: "prev123",
    merkleRoot: "merkle789",
    nonce: 12345,
    difficultyTarget: 4,
    timestamp: 1640000000000,
  },
  blockSize: 150,
  blockIndex: 5,
  transactionCounter: 3,
};

function renderWithProviders(blockId = "abc123") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  global.fetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve(mockBlockData),
  }) as any;

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/blockchain/block-details/${blockId}`]}>
        <Routes>
          <Route
            path="/blockchain/block-details/:id"
            element={
              <>
                {React.createElement(
                  require("@/screens/BlockchainDetails").default,
                )}
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

import React from "react";
import BlockchainDetails from "@/screens/BlockchainDetails";

function renderBlockchainDetails(blockId = "abc123") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  global.fetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve(mockBlockData),
  }) as any;

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/blockchain/block-details/${blockId}`]}>
        <Routes>
          <Route
            path="/blockchain/block-details/:id"
            element={<BlockchainDetails />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("BlockchainDetails Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Blockchain heading", async () => {
    renderBlockchainDetails();
    await waitFor(() => {
      expect(screen.getAllByText("Blockchain").length).toBeGreaterThan(0);
    });
  });

  it("renders the BlockList component", async () => {
    renderBlockchainDetails();
    await waitFor(() => {
      expect(screen.getByTestId("block-list")).toBeInTheDocument();
    });
  });

  it("renders Block details heading after load", async () => {
    renderBlockchainDetails();
    await waitFor(() => {
      expect(screen.getByText("Block details")).toBeInTheDocument();
    });
  });

  it("renders the JSON editor tabs", async () => {
    renderBlockchainDetails();
    await waitFor(() => {
      expect(screen.getByText("Pretty")).toBeInTheDocument();
      expect(screen.getByText("Raw")).toBeInTheDocument();
    });
  });

  it("renders block size in bytes", async () => {
    renderBlockchainDetails();
    await waitFor(() => {
      expect(screen.getByText(/150 bytes/i)).toBeInTheDocument();
    });
  });

  it("renders nonce value", async () => {
    renderBlockchainDetails();
    await waitFor(() => {
      expect(screen.getByText("12345")).toBeInTheDocument();
    });
  });

  it("renders transaction counter", async () => {
    renderBlockchainDetails();
    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });
});
