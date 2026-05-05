import type { ControlState, FixtureKey, FixturePreset } from "./types";

const defaultControlState: ControlState = {
  isPaused: false,
  remainingTime: "12:34",
  liveEventState: null,
  banner: null,
};

export const fixturePresets: Record<FixtureKey, FixturePreset> = {
  default: {
    key: "default",
    label: "Default",
    description: "No active event. Game is running normally.",
    controlState: defaultControlState,
  },
  paused: {
    key: "paused",
    label: "Paused",
    description: "Events are paused and the pause banner is visible.",
    controlState: {
      isPaused: true,
      remainingTime: "12:34",
      liveEventState: null,
      banner: {
        message: "Events are paused. Your community will still gain points.",
        tone: "pause",
        trailingText: "12:34",
      },
    },
  },
  liveEvent: {
    key: "liveEvent",
    label: "Live Event",
    description: "A live event is in progress, so event controls change state.",
    controlState: {
      isPaused: false,
      remainingTime: "12:34",
      liveEventState: {
        state: "in-progress",
        seasonEventId: 818,
      },
      banner: null,
    },
  },
  givePoints: {
    key: "givePoints",
    label: "Give Points",
    description: "A points-awarded banner is visible after giving points.",
    controlState: {
      isPaused: false,
      remainingTime: "12:34",
      liveEventState: null,
      banner: {
        message: "69 points were given to all members.",
        tone: "give",
      },
    },
  },
  takePoints: {
    key: "takePoints",
    label: "Take Points",
    description: "A points-removed banner is visible after taking points.",
    controlState: {
      isPaused: false,
      remainingTime: "12:34",
      liveEventState: null,
      banner: {
        message: "50 points were taken from all members.",
        tone: "take",
      },
    },
  },
};

// These remain in code for internal QA and review, even though the candidate-facing
// page opens in the default state without a visible fixture switcher.
export const fixtureOrder: FixturePreset[] = [
  fixturePresets.default,
  fixturePresets.paused,
  fixturePresets.liveEvent,
  fixturePresets.givePoints,
  fixturePresets.takePoints,
];

export function cloneFixtureControlState(fixtureKey: FixtureKey): ControlState {
  const preset = fixturePresets[fixtureKey].controlState;

  return {
    ...preset,
    liveEventState: preset.liveEventState ? { ...preset.liveEventState } : null,
    banner: preset.banner ? { ...preset.banner } : null,
  };
}
