import { useCallback, useMemo, useState } from "react";

import { mockActionSections, mockEventConstructs, mockFamilies, mockGuild } from "../mockData";
import type { ActionDefinition, ActionSectionKey, FixtureKey } from "../types";
import type { ReactNode } from "react";
import { useControlPanelState } from "../hooks/useControlPanelState";
import { MessageBanner } from "./MessageBanner";
import { SectionedActionPanel } from "./SectionedActionPanel";
import { PlaceholderModal } from "./modals/PlaceholderModal";
import { PointsForm } from "./PointsForm";
import { StartEventForm } from "./StartEventForm";
import { CirclePlay, PauseCircle } from "lucide-react";

type ControlPanelWorkspaceProps = {
  fixtureKey: FixtureKey;
};

export function ControlPanelWorkspace({
  fixtureKey,
}: ControlPanelWorkspaceProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<ActionSectionKey, boolean>
  >({
    events: true,
    mechanics: true,
    membership: true,
    gameManagement: true,
  });

  const {
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
  } = useControlPanelState(fixtureKey);

  const [mechMode, setMechMode] = useState<"points" | "lottery" | "boost">("points");
  const [pointsDirection, setPointsDirection] = useState<"give" | "take">("give");

  const switchDir = useCallback((dir: "give" | "take") => {
    if (dir === pointsDirection) return;
    const from = pointsDirection === "give" ? givePointsState : takePointsState;
    (dir === "give" ? setGivePointsState : setTakePointsState)((prev) => ({
      ...prev,
      recipientType: from.recipientType,
      familyIdentifier: from.familyIdentifier,
      specificMembers: from.specificMembers,
    }));
    setPointsDirection(dir);
  }, [pointsDirection, givePointsState, takePointsState, setGivePointsState, setTakePointsState]);

  const handleSlide = useCallback((dir: "give" | "take", amount: string) => {
    if (dir !== pointsDirection) {
      const from = pointsDirection === "give" ? givePointsState : takePointsState;
      (dir === "give" ? setGivePointsState : setTakePointsState)((prev) => ({
        ...prev,
        recipientType: from.recipientType,
        familyIdentifier: from.familyIdentifier,
        specificMembers: from.specificMembers,
        pointAmount: amount,
      }));
      setPointsDirection(dir);
    } else {
      (dir === "give" ? setGivePointsState : setTakePointsState)((c) => ({ ...c, pointAmount: amount }));
    }
  }, [pointsDirection, givePointsState, takePointsState, setGivePointsState, setTakePointsState]);


  const visibleSections = useMemo(
    () =>
      mockActionSections.map((section) => ({
        ...section,
        actions: section.actions.filter((action) =>
          isActionVisible(action, controlState) &&
          action.action !== "startEvent" &&
          action.action !== "runLottery" &&
          action.action !== "pointBoost",
        ),
      })),
    [controlState],
  );

  const rawMechActions = mockActionSections.find((s) => s.key === "mechanics")?.actions ?? [];
  const lotteryAction = rawMechActions.find((a) => a.action === "runLottery");
  const boostAction = rawMechActions.find((a) => a.action === "pointBoost");

  const sectionBadges: Partial<Record<ActionSectionKey, ReactNode>> = {};
  if (controlState.isPaused) {
    sectionBadges.gameManagement = <span className="section__badge section__badge--pause">
      <PauseCircle />
      Paused
    </span>;
  }
  if (controlState.liveEventState) {
    sectionBadges.events = <span className="section__badge section__badge--live">
      <CirclePlay />
      Live - 00:00:00
    </span>;
  }

  const eventsExtra = controlState.liveEventState ? (
    <dl className="live-event-meta">
      <h3>{mockEventConstructs.find((e) => e.tag === controlState.liveEventState!.eventType)?.label ?? controlState.liveEventState.eventType}</h3>
      <div>
        <dt>Started:</dt>
        <dd>{new Date(controlState.liveEventState.startedAt).toLocaleTimeString()}</dd>
      </div>
      <div>
        <dt>Participants</dt>
        <dd>123</dd>
      </div>
      <div>
        <dt>Engagement score</dt>
        <dd><button title="Explaining tooltip">99</button></dd>
      </div>
    </dl>
  ) : (
    <StartEventForm
      state={startEventState}
      setState={setStartEventState}
      families={mockFamilies}
      eventConstructs={mockEventConstructs}
      onQuickStart={() => setModalState({ type: "placeholder", actionLabel: "Randomize event", onConfirm: startQuickEvent })}
      onCustomStart={startCustomEvent}
    />
  );

  const mechanicsExtra = (
    <div className="mechanics-sub">
      <div className="custom-radios">
        <label>
          <input
            type="radio"
            name="mechanics-mode"
            value="points"
            checked={mechMode === "points"}
            onChange={() => setMechMode("points")}
          />
          {mockGuild.points_icon} {mockGuild.terms.points_synonym_plural}
        </label>
        <label>
          <input
            type="radio"
            name="mechanics-mode"
            value="lottery"
            checked={mechMode === "lottery"}
            onChange={() => setMechMode("lottery")}
          />
          {lotteryAction?.icon} {mockGuild.terms.lottery_synonym_singular}
        </label>
        {boostAction && (
          <label>
            <input
              type="radio"
              name="mechanics-mode"
              value="boost"
              checked={mechMode === "boost"}
              onChange={() => setMechMode("boost")}
            />
            {boostAction.icon} {mockGuild.terms.boost_synonym_singular}
          </label>
        )}
      </div>

      {mechMode === "points" && (
        <PointsForm
          mode={pointsDirection}
          guildMembers={guildMembers}
          families={mockFamilies}
          state={pointsDirection === "give" ? givePointsState : takePointsState}
          setState={pointsDirection === "give" ? setGivePointsState : setTakePointsState}
          onSubmit={() => applyPointsAction(pointsDirection, pointsDirection === "give" ? givePointsState : takePointsState)}
          onGive={() => switchDir("give")}
          onTake={() => switchDir("take")}
          onSlide={handleSlide}
        />
      )}

      {mechMode === "lottery" && lotteryAction && (
        <div className="friendlyWrapper">
          <button
            type="button"
            className="action-tile"
            onClick={() => handleActionClick(lotteryAction)}
          >
            <span className="action-tile__icon" aria-hidden="true">{lotteryAction.icon}</span>
            <span className="action-tile__label">{lotteryAction.name}</span>
          </button>
        </div>
      )}

      {mechMode === "boost" && boostAction && (
        <div className="friendlyWrapper">
          <button
            type="button"
            className="action-tile"
            onClick={() => handleActionClick(boostAction)}
          >
            <span className="action-tile__icon" aria-hidden="true">{boostAction.icon}</span>
            <span className="action-tile__label">{boostAction.name}</span>
          </button>
        </div>
      )}

    </div>
  );

  return (
    <>
      <SectionedActionPanel
        sections={visibleSections}
        expandedSections={expandedSections}
        onToggle={(section) =>
          setExpandedSections((current) => ({
            ...current,
            [section]: !current[section],
          }))
        }
        onActionClick={handleActionClick}
        sectionExtras={{ events: eventsExtra, mechanics: mechanicsExtra }}
        sectionBadges={sectionBadges}
        sectionInnerWrap={controlState.liveEventState ? { events: "event-live-container" } : undefined}
      />

      {controlState.banner ? (
        <MessageBanner
          message={controlState.banner.message}
          tone={controlState.banner.tone}
          trailingText={controlState.banner.trailingText}
        />
      ) : null}

      {modalState && (
        <div className="modal-backdrop" onClick={() => setModalState(null)} />
      )}
      <dialog className="modal" open={!!modalState}>
        {modalState?.type === "placeholder" && (
          <PlaceholderModal
            actionLabel={modalState.actionLabel}
            onClose={() => setModalState(null)}
            onConfirm={modalState.onConfirm}
          />
        )}
      </dialog>
    </>
  );
}

function isActionVisible(
  action: ActionDefinition,
  controlState: ReturnType<typeof useControlPanelState>["controlState"],
) {
  if (action.action === "startEvent") return controlState.liveEventState === null;
  if (action.action === "endEvent" || action.action === "timeoutEvent") {
    return controlState.liveEventState !== null;
  }
  if (action.action === "pauseGame") return !controlState.isPaused;
  if (action.action === "unpauseGame") return controlState.isPaused;
  return true;
}
