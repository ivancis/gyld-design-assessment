import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import type {
  ActionDefinition,
  ActionSection,
  ActionSectionKey,
} from "../types";

type SectionedActionPanelProps = {
  sections: ActionSection[];
  onActionClick: (action: ActionDefinition) => void;
  sectionExtras?: Partial<Record<ActionSectionKey, ReactNode>>;
  sectionBadges?: Partial<Record<ActionSectionKey, ReactNode>>;
  sectionInnerWrap?: Partial<Record<ActionSectionKey, string>>;
};

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia?.("(min-width: 721px)").matches ?? false,
  );
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(min-width: 721px)");
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

export function SectionedActionPanel({
  sections,
  onActionClick,
  sectionExtras,
  sectionBadges,
  sectionInnerWrap,
}: SectionedActionPanelProps) {
  const isDesktop = useIsDesktop();
  const [selectedSection, setSelectedSection] = useState<ActionSectionKey | null>(null);

  const visibleSections = sections.filter((s) => {
    const extra = sectionExtras?.[s.key];
    return s.actions.length > 0 || !!extra;
  });

  const renderContent = (key: ActionSectionKey) => {
    const section = visibleSections.find((s) => s.key === key);
    if (!section) return null;
    const extra = sectionExtras?.[key];
    const wrapClass = sectionInnerWrap?.[key];
    const inner = (
      <>
        {extra}
        {section.actions.length > 0 && (
          <div className="action-grid">
            {section.actions.map((action) => (
              <button
                key={action.action}
                type="button"
                className={`action-tile${action.disabled ? " action-tile--disabled" : ""}${action.action === "unpauseGame" ? " action-tile--gold" : ""}`}
                disabled={action.disabled}
                onClick={() => onActionClick(action)}
              >
                <span className="action-tile__icon" aria-hidden="true">
                  {action.icon}
                </span>
                <span className="action-tile__label">{action.name}</span>
              </button>
            ))}
          </div>
        )}
      </>
    );
    return wrapClass ? <div className={wrapClass}>{inner}</div> : inner;
  };

  if (isDesktop) {
    const active = selectedSection ?? visibleSections[0]?.key;
    return (
      <div className="tabNav">
        <div className="custom-radios custom-radios--firstLevel">
          {visibleSections.map((section) => (
            <label
              key={section.key}
              className={active === section.key ? "tabNavItem tabNav--selected" : "tabNavItem"}
              onClick={() => setSelectedSection(section.key)}
            >
              <span>{section.icon}</span>
              <span>{section.title}</span>
              {sectionBadges?.[section.key]}
            </label>
          ))}
        </div>
        {active && (
          <section className="section">
            <div className="section__content">
              {renderContent(active)}
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="tileNavContainer">
      {selectedSection === null ? (
        <ul className="tileNav">
          {visibleSections.map((section) => (
            <li key={section.key}>
              <button
                type="button"
                className="action-tile"
                onClick={() => setSelectedSection(section.key)}
              >
                <span className="action-tile__icon" aria-hidden="true">
                  {section.icon}
                </span>
                <span className="action-tile__label">{section.title}</span>
              </button>
              {sectionBadges?.[section.key] && (
                <span className="section__badge">
                  {sectionBadges[section.key]}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <section className="section section--tileNav">
          <div className="section__header section__header--tileNav">
            <button
              type="button"
              title="Go back"
              className="icon-btn tertiary"
              onClick={() => setSelectedSection(null)}
            >
              <ChevronLeft />
            </button>
            <p>{visibleSections.find((s) => s.key === selectedSection)?.title}</p>
            {sectionBadges?.[selectedSection] && (
              <span className="section__badge section__badge--live">
                {sectionBadges[selectedSection]}
              </span>
            )}
          </div>
          <div className="section__content">
            {renderContent(selectedSection)}
          </div>
        </section>
      )}
    </div>
  );
}
