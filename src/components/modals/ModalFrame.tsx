import type { ReactNode } from "react";

type ModalFrameProps = {
  eyebrow: string;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function ModalFrame({
  eyebrow,
  title,
  onClose,
  children,
}: ModalFrameProps) {
  return (
    <>
      <div className="modal-header">
        <div>
          <p className="modal-eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <button type="button" className="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="wizard-body">{children}</div>
    </>
  );
}
