import { useMemo, useState } from "react";

import { mockActionSections, mockEventConstructs, mockFamilies, mockGuild } from "../mockData";
import type { ActionDefinition, ActionSectionKey, FixtureKey } from "../types";
import { useControlPanelState } from "../hooks/useControlPanelState";
import { PauseBanner } from "./PauseBanner";
import { SectionedActionPanel } from "./SectionedActionPanel";
import { PlaceholderModal } from "./modals/PlaceholderModal";
import { PointsModal } from "./modals/PointsModal";
import { StartEventModal } from "./modals/StartEventModal";

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

  const visibleSections = useMemo(
    () =>
      mockActionSections.map((section) => ({
        ...section,
        actions: section.actions.filter((action) =>
          isActionVisible(action, controlState),
        ),
      })),
    [controlState],
  );

  return (
    <>
      {controlState.banner ? (
        <PauseBanner
          message={controlState.banner.message}
          tone={controlState.banner.tone}
          trailingText={controlState.banner.trailingText}
        />
      ) : null}

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
      />

      {modalState ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setModalState(null)}>
          <div className="modal-shell" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            {modalState.type === "startEvent" ? (
              <StartEventModal
                state={startEventState}
                setState={setStartEventState}
                families={mockFamilies}
                eventConstructs={mockEventConstructs}
                onQuickStart={startQuickEvent}
                onCustomStart={startCustomEvent}
                onClose={() => setModalState(null)}
              />
            ) : null}

            {modalState.type === "givePoints" ? (
              <PointsModal
                title={`Give ${mockGuild.terms.points_synonym_plural}`}
                mode="give"
                guildMembers={guildMembers}
                families={mockFamilies}
                state={givePointsState}
                setState={setGivePointsState}
                onSubmit={() => applyPointsAction("give", givePointsState)}
                onClose={() => setModalState(null)}
              />
            ) : null}

            {modalState.type === "takePoints" ? (
              <PointsModal
                title={`Take ${mockGuild.terms.points_synonym_plural}`}
                mode="take"
                guildMembers={guildMembers}
                families={mockFamilies}
                state={takePointsState}
                setState={setTakePointsState}
                onSubmit={() => applyPointsAction("take", takePointsState)}
                onClose={() => setModalState(null)}
              />
            ) : null}

            {modalState.type === "placeholder" ? (
              <PlaceholderModal
                actionLabel={modalState.actionLabel}
                onClose={() => setModalState(null)}
              />
            ) : null}
          </div>
        </div>
      ) : null}
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
