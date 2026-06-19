import type { Dispatch, SetStateAction } from "react";

import type { EventConstruct, Family, StartEventState } from "../../types";
import { ModalFrame } from "./ModalFrame";

type StartEventModalProps = {
  state: StartEventState;
  setState: Dispatch<SetStateAction<StartEventState>>;
  families: Family[];
  eventConstructs: EventConstruct[];
  onQuickStart: () => void;
  onCustomStart: () => void;
  onClose: () => void;
};

export function StartEventModal({
  state,
  setState,
  families,
  eventConstructs,
  onQuickStart,
  onCustomStart,
  onClose,
}: StartEventModalProps) {
  const selectedEvent = eventConstructs.find(
    (construct) => construct.tag === state.eventType,
  );

  return (
    <ModalFrame eyebrow="Events" title="Start Event" onClose={onClose}>
      <div className="mode-switch">
        <button
          type="button"
          className={state.isQuickStart ? "mode-switch__active" : ""}
          onClick={() => setState((current) => ({ ...current, isQuickStart: true }))}
        >
          Quick Start
        </button>
        <button
          type="button"
          className={!state.isQuickStart ? "mode-switch__active" : ""}
          onClick={() => setState((current) => ({ ...current, isQuickStart: false }))}
        >
          Custom
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          state.isQuickStart ? onQuickStart() : onCustomStart();
        }}
      >
        {state.isQuickStart ? (
          <>
            <p className="wizard-copy">
              Start a random event immediately with the same shortcut pattern as
              the real control panel.
            </p>
            <button type="submit" className="primary-button">
              Start Event
            </button>
          </>
        ) : (
          <>
            <label className="form-field">
              <span>Event type</span>
              <select
                autoComplete="off"
                value={state.eventType}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    eventType: event.target.value,
                  }))
                }
              >
                {eventConstructs.map((construct) => (
                  <option key={construct.tag} value={construct.tag}>
                    {construct.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="wizard-row">
              <label className="form-field">
                <span>First family</span>
                <select
                  autoComplete="off"
                  value={state.selectedFamilyA}
                  onChange={(event) =>
                    setState((current) => ({
                      ...current,
                      selectedFamilyA: event.target.value,
                    }))
                  }
                >
                  {families.map((family) => (
                    <option key={family.identifier} value={family.identifier}>
                      {family.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="form-field">
                <span>Second family</span>
                <select
                  autoComplete="off"
                  value={state.selectedFamilyB}
                  onChange={(event) =>
                    setState((current) => ({
                      ...current,
                      selectedFamilyB: event.target.value,
                    }))
                  }
                >
                  {families.map((family) => (
                    <option key={family.identifier} value={family.identifier}>
                      {family.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="form-field">
              <span>Custom chat message</span>
              <textarea
                rows={4}
                spellCheck={false}
                autoComplete="off"
                value={state.customMessage}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    customMessage: event.target.value,
                  }))
                }
              />
            </label>

            <div className="review-card">
              <strong>{selectedEvent?.label ?? "Selected event"}</strong>
              <span>{selectedEvent?.description}</span>
            </div>

            <button type="submit" className="primary-button">
              Start Event
            </button>
          </>
        )}
      </form>
    </ModalFrame>
  );
}
