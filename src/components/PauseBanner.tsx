type StatusBannerProps = {
  message: string;
  tone: "pause" | "give" | "take";
  trailingText?: string;
};

export function PauseBanner({ message, tone, trailingText }: StatusBannerProps) {
  return (
    <div className={`pause-banner pause-banner--${tone}`}>
      <span>{message}</span>
      {trailingText ? <strong>{trailingText}</strong> : null}
    </div>
  );
}
