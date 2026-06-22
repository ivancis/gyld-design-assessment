import { X } from "lucide-react";
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
      <div className="modal__header">
        <div>
          <p className="modal__eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <button type="button" className="icon-btn" onClick={onClose} title="Close" autoFocus>
          <X />
        </button>
      </div>
      <div className="modal__body">{children}</div>
    </>
  );
}
