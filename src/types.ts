export type ActionSectionKey =
  | "events"
  | "mechanics"
  | "membership"
  | "gameManagement";

export type ActionDefinition = {
  name: string;
  action: string;
  icon: string;
  disabled?: boolean;
};

export type ActionSection = {
  key: ActionSectionKey;
  title: string;
  icon: string;
  actions: ActionDefinition[];
};

export type Family = {
  identifier: string;
  name: string;
  color: string;
};

export type GuildMember = {
  name: string;
  familyIdentifier: string;
  points: number;
};

export type EventConstruct = {
  tag: string;
  label: string;
  description: string;
};

export type LiveEventState = {
  state: "in-progress";
  seasonEventId: number;
} | null;

export type ControlState = {
  isPaused: boolean;
  remainingTime: string;
  liveEventState: LiveEventState;
  banner: {
    message: string;
    tone: "pause" | "give" | "take";
    trailingText?: string;
  } | null;
};

export type FixtureKey =
  | "default"
  | "paused"
  | "liveEvent"
  | "givePoints"
  | "takePoints";

export type FixturePreset = {
  key: FixtureKey;
  label: string;
  description: string;
  controlState: ControlState;
};

export type ModalState =
  | { type: "startEvent" }
  | { type: "givePoints" }
  | { type: "takePoints" }
  | { type: "placeholder"; actionLabel: string }
  | null;

export type StartEventState = {
  isQuickStart: boolean;
  eventType: string;
  selectedFamilyA: string;
  selectedFamilyB: string;
  customMessage: string;
};

export type PointsState = {
  recipientType: "all" | "families" | "specific";
  familyIdentifier: string;
  specificMembers: string;
  pointAmount: string;
};
