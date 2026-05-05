import { useState } from "react";

import { cloneFixtureControlState } from "../fixtures";
import {
  mockEventConstructs,
  mockFamilies,
  mockGuildMembers,
} from "../mockData";
import type {
  ActionDefinition,
  FixtureKey,
  GuildMember,
  ModalState,
  PointsState,
  StartEventState,
} from "../types";

const initialStartEventState: StartEventState = {
  isQuickStart: true,
  eventType: mockEventConstructs[0]?.tag ?? "boss",
  selectedFamilyA: mockFamilies[0]?.identifier ?? "north-house",
  selectedFamilyB: mockFamilies[1]?.identifier ?? "south-house",
  customMessage: "",
};

const initialGivePointsState: PointsState = {
  recipientType: "all",
  familyIdentifier: "all",
  specificMembers: "",
  pointAmount: "69",
};

const initialTakePointsState: PointsState = {
  recipientType: "all",
  familyIdentifier: "all",
  specificMembers: "",
  pointAmount: "50",
};

export function useControlPanelState(fixtureKey: FixtureKey) {
  const [modalState, setModalState] = useState<ModalState>(null);
  const [controlState, setControlState] = useState(
    cloneFixtureControlState(fixtureKey),
  );
  const [guildMembers, setGuildMembers] =
    useState<GuildMember[]>(mockGuildMembers);
  const [startEventState, setStartEventState] = useState(initialStartEventState);
  const [givePointsState, setGivePointsState] = useState(initialGivePointsState);
  const [takePointsState, setTakePointsState] = useState(initialTakePointsState);

  const handleActionClick = (action: ActionDefinition) => {
    switch (action.action) {
      case "startEvent":
        setModalState({ type: "startEvent" });
        return;
      case "givePoints":
        setModalState({ type: "givePoints" });
        return;
      case "takePoints":
        setModalState({ type: "takePoints" });
        return;
      case "endEvent":
      case "timeoutEvent":
        if (!controlState.liveEventState) return;
        setControlState((current) => ({
          ...current,
          liveEventState: null,
        }));
        return;
      case "pauseGame":
        setControlState((current) => ({
          ...current,
          isPaused: true,
          banner: {
            message: "Events are paused. Your community will still gain points.",
            tone: "pause",
            trailingText: current.remainingTime,
          },
        }));
        return;
      case "unpauseGame":
        setControlState((current) => ({
          ...current,
          isPaused: false,
          banner: null,
        }));
        return;
      default:
        setModalState({ type: "placeholder", actionLabel: action.name });
    }
  };

  const startQuickEvent = () => {
    setControlState((current) => ({
      ...current,
      liveEventState: { state: "in-progress", seasonEventId: Date.now() },
      // Starting an event should supersede prior banner states.
      banner: null,
    }));
    setModalState(null);
  };

  const startCustomEvent = () => {
    setControlState((current) => ({
      ...current,
      liveEventState: { state: "in-progress", seasonEventId: Date.now() },
      // Starting an event should supersede prior banner states.
      banner: null,
    }));
    setModalState(null);
  };

  const applyPointsAction = (mode: "give" | "take", state: PointsState) => {
    const amount = Number(state.pointAmount || "0");
    const specificMembers = state.specificMembers
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);

    setGuildMembers((current) =>
      current.map((member) => {
        const matchesAll = state.recipientType === "all";
        const matchesFamily =
          state.recipientType === "families" &&
          member.familyIdentifier === state.familyIdentifier;
        const matchesSpecific =
          state.recipientType === "specific" &&
          specificMembers.includes(member.name);

        if (!(matchesAll || matchesFamily || matchesSpecific)) {
          return member;
        }

        const nextPoints =
          mode === "give"
            ? member.points + amount
            : Math.max(0, member.points - amount);

        return { ...member, points: nextPoints };
      }),
    );

    setControlState((current) => ({
      ...current,
      banner: {
        message:
          mode === "give"
            ? `${amount} points were given to ${
                state.recipientType === "all" ? "all members" : "selected recipients"
              }.`
            : `${amount} points were taken from ${
                state.recipientType === "all" ? "all members" : "selected recipients"
              }.`,
        tone: mode,
      },
    }));

    setModalState(null);
  };

  return {
    controlState,
    guildMembers,
    modalState,
    setModalState,
    startEventState,
    setStartEventState,
    givePointsState,
    setGivePointsState,
    takePointsState,
    setTakePointsState,
    handleActionClick,
    startQuickEvent,
    startCustomEvent,
    applyPointsAction,
  };
}
