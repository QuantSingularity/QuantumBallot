/**
 * Tests for votingService
 */

import {
  checkHasVoted,
  submitVote,
  verifyOTPAndVote,
} from "src/services/votingService";
import { mockAxios } from "../fixtures/mockAxios";

jest.mock("src/api/axios");

describe("votingService", () => {
  beforeEach(() => {
    mockAxios.mockClear();
  });

  describe("checkHasVoted", () => {
    it("returns hasVoted: true when API says so", async () => {
      mockAxios.get.mockResolvedValueOnce({
        status: 200,
        data: { hasVoted: true, voteTimestamp: "2025-01-01T00:00:00Z" },
      });

      const result = await checkHasVoted("TEST123", "3010");
      expect(result.hasVoted).toBe(true);
    });

    it("returns hasVoted: false when API says so", async () => {
      mockAxios.get.mockResolvedValueOnce({
        status: 200,
        data: { hasVoted: false },
      });

      const result = await checkHasVoted("TEST123", "3010");
      expect(result.hasVoted).toBe(false);
    });

    it("returns hasVoted: false on 404 (endpoint not implemented)", async () => {
      mockAxios.get.mockRejectedValueOnce({
        response: { status: 404 },
      });

      const result = await checkHasVoted("TEST123", "3010");
      expect(result.hasVoted).toBe(false);
    });

    it("throws on non-404 errors", async () => {
      mockAxios.get.mockRejectedValueOnce({
        response: { status: 500, data: { message: "Server Error" } },
      });

      await expect(checkHasVoted("TEST123", "3010")).rejects.toBeTruthy();
    });
  });

  describe("submitVote", () => {
    it("returns success with transactionHash on 200", async () => {
      mockAxios.post.mockResolvedValueOnce({
        status: 200,
        data: { transactionHash: "0xabc123", message: "Vote recorded" },
      });

      const result = await submitVote(
        {
          candidateCode: 1,
          electoralId: "TEST123",
          timestamp: "2025-01-01T00:00:00Z",
        },
        "3010",
      );

      expect(result.success).toBe(true);
      expect(result.transactionHash).toBe("0xabc123");
    });

    it("returns success: false on API error", async () => {
      mockAxios.post.mockRejectedValueOnce({
        response: { status: 409, data: { message: "Already voted" } },
      });

      const result = await submitVote(
        {
          candidateCode: 1,
          electoralId: "TEST123",
          timestamp: "2025-01-01T00:00:00Z",
        },
        "3010",
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe("Already voted");
    });
  });

  describe("verifyOTPAndVote", () => {
    it("returns success on OTP + vote success", async () => {
      mockAxios.post
        .mockResolvedValueOnce({ status: 200, data: {} })
        .mockResolvedValueOnce({
          status: 200,
          data: { transactionHash: "0xdef456" },
        });

      const result = await verifyOTPAndVote({
        email: "test@test.com",
        token: "test-token",
        otpCode: "123456",
        candidateCode: 1,
        electoralId: "TEST123",
        port: "3010",
      });

      expect(result.success).toBe(true);
    });

    it("returns failure when OTP verification fails", async () => {
      mockAxios.post.mockRejectedValueOnce({
        response: { status: 401, data: { message: "Invalid OTP" } },
      });

      const result = await verifyOTPAndVote({
        email: "test@test.com",
        token: "test-token",
        otpCode: "000000",
        candidateCode: 1,
        electoralId: "TEST123",
        port: "3010",
      });

      expect(result.success).toBe(false);
    });
  });
});
