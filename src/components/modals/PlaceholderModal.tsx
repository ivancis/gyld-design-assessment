import { ModalFrame } from "./ModalFrame";

type PlaceholderModalProps = {
  actionLabel: string;
  onClose: () => void;
  onConfirm?: () => void;
};

export function PlaceholderModal({
  actionLabel,
  onClose,
  onConfirm,
}: PlaceholderModalProps) {
  return (
    <ModalFrame eyebrow="Assessment mock" title={actionLabel} onClose={onClose}>
      <p className="modal__copy">
        This action is intentionally left as a lightweight placeholder in the
        assessment foundation. Candidates can replace or deepen this flow if
        they believe it supports the objective.
      </p>
      {onConfirm && (
        <div className="modal__row">
          <button type="button" className="primary-button" onClick={onConfirm}>Confirm</button>
          <button type="button" className="reset-button" onClick={onClose}>Cancel</button>
        </div>
      )}
    </ModalFrame>
  );
}
