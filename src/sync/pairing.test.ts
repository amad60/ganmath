import { describe, expect, it } from "vitest";
import { PAIRING_TTL_MS, randomPairingCode } from "./pairing";

describe("randomPairingCode", () => {
  it("selalu 6 digit", () => {
    for (let i = 0; i < 20; i++) {
      expect(randomPairingCode()).toMatch(/^\d{6}$/);
    }
  });

  it("berlaku 10 menit", () => {
    expect(PAIRING_TTL_MS).toBe(10 * 60 * 1000);
  });
});
