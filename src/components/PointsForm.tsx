import { useRef, type Dispatch, type SetStateAction } from "react";

import type { Family, GuildMember, PointsState } from "../types";
import { mockGuild } from "../mockData";
import { RefreshCw } from "lucide-react";

type PointsFormProps = {
  mode: "give" | "take";
  guildMembers: GuildMember[];
  families: Family[];
  state: PointsState;
  setState: Dispatch<SetStateAction<PointsState>>;
  onSubmit: () => void;
  onGive?: () => void;
  onTake?: () => void;
  onSlide?: (dir: "give" | "take", amount: string) => void;
};

export function PointsForm({
  mode,
  guildMembers,
  families,
  state,
  setState,
  onSubmit,
  onGive,
  onTake,
  onSlide,
}: PointsFormProps) {
  const { terms } = mockGuild;
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const amountRef = useRef<HTMLInputElement>(null);
  const isNeutral = Math.abs(Number(state.pointAmount)) === 0;

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      if (isNeutral) {
        amountRef.current?.setCustomValidity("Amount must be greater than 0");
        amountRef.current?.reportValidity();
        return;
      }
      amountRef.current?.setCustomValidity("");
      onSubmit();
    }}>
      <div className="controls-top-row">
        <div className="custom-radios custom-radios__pill">
          <label className={`customRadioLabel label--take${isNeutral ? " label--neutral" : ""}`}>
            <input type="radio" name="points-dir" checked={mode === "take"} onChange={() => onTake?.()} />
            {terms.points_take_verb}
          </label>
          <label className={`customRadioLabel label--give${isNeutral ? " label--neutral" : ""}`}>
            <input type="radio" name="points-dir" checked={mode === "give"} onChange={() => onGive?.()} />
            {terms.points_give_verb}
          </label>
        </div>
      </div>

      <label className="form-field numberSlider">
        <input
          ref={amountRef}
          type="number"
          required
          autoComplete="off"
          placeholder="0"
          className={isNeutral ? "input--neutral" : `input--${mode}`}
          value={state.pointAmount}
          onChange={(event) => {
            amountRef.current?.setCustomValidity("");
            setState((current) => ({ ...current, pointAmount: event.target.value }));
          }}
        />
        <input
          type="range"
          min={-500}
          max={500}
          step={1}
          list="points-ticks"
          value={Number(state.pointAmount) || 0}
          onChange={(e) => {
            const v = Number(e.target.value);
            const dir = v < 0 ? "take" : "give";
            onSlide?.(dir, String(v));
          }}
        />
        <datalist id="points-ticks">
          {[-500,-200,-100,-69,-50,0,50,69,100,200,500].map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
      </label>

      <div className="audience-row">
        <label className="form-field">
          <span>To:</span>
          <select
            autoComplete="off"
            value={state.recipientType}
            onChange={(event) =>
              setState((current) => ({
                ...current,
                recipientType: event.target.value as PointsState["recipientType"],
              }))
            }
          >
            <option value="all">All {cap(terms.member_synonym_plural)}</option>
            <option value="families">{cap(terms.family_synonym_singular)}</option>
            <option value="specific">Some {cap(terms.member_synonym_plural)}</option>
          </select>
        </label>

        {state.recipientType === "families" && (
          <label className="form-field">
            <span>Family</span>
            <select
              autoComplete="off"
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
        )}

        {state.recipientType === "specific" && (
          <label className="form-field">
            <span>Members:</span>
            <textarea
              rows={3}
              spellCheck={false}
              autoComplete="off"
              style={{ resize: "none" }}
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
        )}
      </div>

      <div className="form-bottom-wrap">
        <div className="submit-row">
          <button
            type="submit"
            className={mode === "give" ? "success-button" : "danger-button"}
          >
            {mode === "give" ? `${terms.points_give_verb} ${terms.points_synonym_plural}` : `${terms.points_take_verb} ${terms.points_synonym_plural}`}
          </button>
          <button
            type="button"
            title="Reset"
            className="icon-btn tertiary"
            disabled={isNeutral}
            onClick={() => setState((c) => ({ ...c, pointAmount: "0" }))}
          >
            <RefreshCw />
          </button>
        </div>
      </div>
    </form>
  );
}
