import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ErrorBoundary from "@/components/ErrorBoundary";

// Component that throws an error
const ThrowError = () => {
  throw new Error("Test error");
};

// Component that works normally
const WorkingComponent = () => <div>Working Component</div>;

describe("ErrorBoundary", () => {
  // Suppress console errors in tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it("should render children when there is no error", () => {
    render(
      <ErrorBoundary>
        <WorkingComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Working Component")).toBeInTheDocument();
  });

  it("should render error UI when child component throws", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(
      screen.getByText(/We're sorry for the inconvenience/),
    ).toBeInTheDocument();
  });

  it("should render custom fallback if provided", () => {
    const customFallback = <div>Custom Error Message</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Custom Error Message")).toBeInTheDocument();
  });

  it("should have Try Again and Go Home buttons", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Try Again")).toBeInTheDocument();
    expect(screen.getByText("Go Home")).toBeInTheDocument();
  });
});
