import { ModalFrame } from "./ModalFrame";

type PlaceholderModalProps = {
  actionLabel: string;
  onClose: () => void;
};

export function PlaceholderModal({
  actionLabel,
  onClose,
}: PlaceholderModalProps) {
  return (
    <ModalFrame eyebrow="Assessment mock" title={actionLabel} onClose={onClose}>
      <p className="wizard-copy">
        This action is intentionally left as a lightweight placeholder in the
        assessment foundation. Candidates can replace or deepen this flow if
        they believe it supports the objective.
      </p>
    </ModalFrame>
  );
}
