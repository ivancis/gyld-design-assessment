import type { Dispatch, SetStateAction } from "react";

import type { Family, GuildMember, PointsState } from "../../types";
import { ModalFrame } from "./ModalFrame";

type PointsModalProps = {
  title: string;
  mode: "give" | "take";
  guildMembers: GuildMember[];
  families: Family[];
  state: PointsState;
  setState: Dispatch<SetStateAction<PointsState>>;
  onSubmit: () => void;
  onClose: () => void;
};

export function PointsModal({
  title,
  mode,
  guildMembers,
  families,
  state,
  setState,
  onSubmit,
  onClose,
}: PointsModalProps) {
  const recipientLabel =
    state.recipientType === "all"
      ? "All members"
      : state.recipientType === "families"
        ? families.find((family) => family.identifier === state.familyIdentifier)
            ?.name ?? "Selected family"
        : state.specificMembers || "Specific members";

  return (
    <ModalFrame eyebrow="Rewards & Punishments" title={title} onClose={onClose}>
      <label className="form-field">
        <span>Recipient type</span>
        <select
          value={state.recipientType}
          onChange={(event) =>
            setState((current) => ({
              ...current,
              recipientType: event.target.value as PointsState["recipientType"],
            }))
          }
        >
          <option value="all">All members</option>
          <option value="families">Families</option>
          <option value="specific">Specific members</option>
        </select>
      </label>

      {state.recipientType === "families" ? (
        <label className="form-field">
          <span>Family</span>
          <select
            value={state.familyIdentifier}
            onChange={(event) =>
              setState((current) => ({
                ...current,
                familyIdentifier: event.target.value,
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
      ) : null}

      {state.recipientType === "specific" ? (
        <label className="form-field">
          <span>Specific members</span>
          <textarea
            rows={3}
            value={state.specificMembers}
            onChange={(event) =>
              setState((current) => ({
                ...current,
                specificMembers: event.target.value,
              }))
            }
            placeholder={guildMembers.map((member) => member.name).join(", ")}
          />
        </label>
      ) : null}

      <label className="form-field">
        <span>Point amount</span>
        <input
          type="number"
          min={1}
          value={state.pointAmount}
          onChange={(event) =>
            setState((current) => ({
              ...current,
              pointAmount: event.target.value,
            }))
          }
        />
      </label>

      <div className="review-card">
        <strong>{mode === "give" ? "Review reward" : "Review punishment"}</strong>
        <span>
          {recipientLabel} · {state.pointAmount} points
        </span>
      </div>

      <button
        type="button"
        className={mode === "give" ? "primary-button" : "danger-button"}
        onClick={onSubmit}
      >
        {title}
      </button>
    </ModalFrame>
  );
}
