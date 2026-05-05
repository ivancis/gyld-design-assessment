import type {
  ActionSection,
  EventConstruct,
  Family,
  GuildMember,
} from "./types";

export const mockGuild = {
  name: "Scorpio Plays",
  terms: {
    points_synonym_singular: "point",
    points_synonym_plural: "points",
    family_synonym_singular: "family",
    family_synonym_plural: "families",
    season_synonym_singular: "season",
  },
};

export const mockFamilies: Family[] = [
  { identifier: "north-house", name: "North House", color: "#7c9cff" },
  {
    identifier: "south-house",
    // Intentionally long to surface layout decisions in family-related UI.
    name: "South House of the Endless Midnight Chorus",
    color: "#d791ff",
  },
  { identifier: "ember-house", name: "Ember House", color: "#f7a35c" },
];

export const mockGuildMembers: GuildMember[] = [
  { name: "VantaWolf", familyIdentifier: "north-house", points: 6800 },
  {
    // Intentionally long to make overflow and spacing issues easier to notice.
    name: "MintRaiderTheThirdOfThePerpetualQueue",
    familyIdentifier: "south-house",
    points: 4250,
  },
  { name: "PatchNotes", familyIdentifier: "ember-house", points: 8125 },
  { name: "HexBloom", familyIdentifier: "north-house", points: 2980 },
];

export const mockEventConstructs: EventConstruct[] = [
  {
    tag: "boss",
    label: "Boss",
    description: "High-pressure live moment with a big room-wide objective.",
  },
  {
    tag: "family_duel",
    label: "Feud",
    description: "Head-to-head conflict between two families during stream.",
  },
  {
    tag: "roll_call",
    label: "Roll Call",
    description: "Participation-focused event that rewards quick reactions.",
  },
];

export const mockActionSections: ActionSection[] = [
  {
    key: "events",
    title: "Events",
    icon: "⚔️",
    actions: [
      { name: "Start Event", action: "startEvent", icon: "⚔️" },
      { name: "End Event", action: "endEvent", icon: "⏹️" },
      { name: "Timeout Event", action: "timeoutEvent", icon: "⏰" },
    ],
  },
  {
    key: "mechanics",
    title: "Rewards & Punishments",
    icon: "⚡",
    actions: [
      { name: "Run Lottery", action: "runLottery", icon: "🎟️" },
      { name: "Point Boost", action: "pointBoost", icon: "✖️2" },
      { name: "Give Points", action: "givePoints", icon: "🪙" },
      { name: "Take Points", action: "takePoints", icon: "⚠️" },
    ],
  },
  {
    key: "membership",
    title: "Membership",
    icon: "👥",
    actions: [
      { name: "Change Member's Family", action: "changeFamily", icon: "🔀" },
      { name: "Check Family Roster", action: "checkRoster", icon: "📋" },
      { name: "Manage Roles", action: "manageRoles", icon: "👥" },
      { name: "Manage Privileges", action: "managePrivileges", icon: "🛡️" },
      { name: "Blocklist", action: "manageBlocklist", icon: "⛔" },
    ],
  },
  {
    key: "gameManagement",
    title: "Game Management",
    icon: "🎮",
    actions: [
      { name: "Start New Season", action: "endSeason", icon: "🗓️" },
      { name: "Pause Game", action: "pauseGame", icon: "⏸️" },
      { name: "Unpause Game", action: "unpauseGame", icon: "▶️" },
    ],
  },
];
