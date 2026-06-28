import { describe, expect, it } from "vitest";
import { assertStorySeedLocked, passBaton } from "./storyFlow";

describe("story flow", () => {
  it("accepts complete locked story seeds", () => {
    expect(assertStorySeedLocked({ character: "Explorer", setting: "Moon", problem: "Lost light", tone: "Brave", visualFormat: "storybook" })).toMatchObject({ character: "Explorer" });
  });

  it("rejects incomplete story seeds", () => {
    expect(() => assertStorySeedLocked({ character: "Explorer" })).toThrow("Story seed is missing");
  });

  it("passes the baton from the current holder", () => {
    expect(passBaton({ holderParticipantId: "dad", activeSpeakerParticipantId: "dad" }, "dad", "profile")).toEqual({ holderParticipantId: "profile", activeSpeakerParticipantId: "profile" });
  });

  it("rejects baton passes from non-holders", () => {
    expect(() => passBaton({ holderParticipantId: "dad", activeSpeakerParticipantId: "dad" }, "profile", "dad")).toThrow("current holder");
  });
});
