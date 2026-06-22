import type { Dispatch, SetStateAction } from "react";
import { Dices } from "lucide-react";

import type { EventConstruct, Family, StartEventState } from "../types";
import { mockGuild } from "../mockData";

type StartEventFormProps = {
  state: StartEventState;
  setState: Dispatch<SetStateAction<StartEventState>>;
  families: Family[];
  eventConstructs: EventConstruct[];
  onQuickStart: () => void;
  onCustomStart: () => void;
};

export function StartEventForm({
  state,
  setState,
  families,
  eventConstructs,
  onQuickStart,
  onCustomStart,
}: StartEventFormProps) {
  const selectedEvent = eventConstructs.find(
    (construct) => construct.tag === state.eventType,
  );
  const { terms } = mockGuild;

  return (
    <form
      className="start-event-form"
      onSubmit={(e) => {
        e.preventDefault();
        onCustomStart();
      }}
    >
      <h3>Create event</h3>
      <div className="input-button">
        <label className="form-field">
          <select
            required
            aria-label="Event type"
            autoComplete="off"
            value={state.eventType}
            onChange={(event) =>
              setState((current) => ({
                ...current,
                eventType: event.target.value,
              }))
            }
          >
            <option value="" disabled>Select Event type</option>
            {eventConstructs.map((construct) => (
              <option key={construct.tag} value={construct.tag}>
                {construct.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="icon-btn"
          title="Shuffle Event configuration"
          onClick={() => {
            const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
            setState((current) => ({
              ...current,
              eventType: pick(eventConstructs).tag,
              selectedFamilyA: pick(families).identifier,
              selectedFamilyB: pick(families).identifier,
            }));
          }}
        >
          <Dices />
        </button>
      </div>

      {state.eventType && <>
        <div className="review-card">
          <span><strong>{selectedEvent?.label} event:</strong>{selectedEvent?.description}</span>
        </div>

        <div className="modal__row">
          <label className="form-field">
            <span>First {terms.family_synonym_singular}</span>
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
            <span>Second {terms.family_synonym_singular}</span>
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
      </>}

      <div className="form-bottom-wrap">
        <div className="submit-row">
          <button type="submit" className="primary-button">
            Start Event
          </button>
          <button type="button" className="secondary-button tertiary" onClick={onQuickStart}>
            Randomize
          </button>
        </div>
      </div>
    </form>
  );
}
