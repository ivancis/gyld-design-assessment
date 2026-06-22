import { useEffect } from "react";
import { X } from "lucide-react";

type MessageBannerProps = {
  message: string;
  tone: "pause" | "give" | "take";
  trailingText?: string;
  duration?: number;
  onDismiss?: () => void;
};

export function MessageBanner({ message, tone, trailingText, duration, onDismiss }: MessageBannerProps) {
  useEffect(() => {
    if (!duration || !onDismiss) return;
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [duration, onDismiss]);

  return (
    <div className={`banner banner--${tone}`}>
      <p>
        {trailingText ? <strong>({trailingText})</strong> : null}
        {message}
      </p>
      {onDismiss ? (
        <button
          type="button"
          className="banner__close"
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      ) : null}
    </div>
  );
}
