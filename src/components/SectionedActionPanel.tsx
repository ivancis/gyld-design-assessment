import { ChevronDown, ChevronUp } from "lucide-react";
import type { ReactNode } from "react";
import type {
  ActionDefinition,
  ActionSection,
  ActionSectionKey,
} from "../types";

type SectionedActionPanelProps = {
  sections: ActionSection[];
  expandedSections: Record<ActionSectionKey, boolean>;
  onToggle: (section: ActionSectionKey) => void;
  onActionClick: (action: ActionDefinition) => void;
  sectionExtras?: Partial<Record<ActionSectionKey, ReactNode>>;
  sectionBadges?: Partial<Record<ActionSectionKey, ReactNode>>;
  sectionInnerWrap?: Partial<Record<ActionSectionKey, string>>;
};

export function SectionedActionPanel({
  sections,
  expandedSections,
  onToggle,
  onActionClick,
  sectionExtras,
  sectionBadges,
  sectionInnerWrap,
}: SectionedActionPanelProps) {
  return (
    <div className="sections-stack">
      {sections.map((section) => {
        const extra = sectionExtras?.[section.key];
        if (section.actions.length === 0 && !extra) return null;

        const isExpanded = expandedSections[section.key];

        return (
          <section
            key={section.key}
            className="section"
          >
            <button
              type="button"
              className="section__header"
              aria-expanded={isExpanded}
              onClick={() => onToggle(section.key)}
              title={`${isExpanded ? "Collapse" : "Expand"} ${section.title}`}
            >
              <div className="section__title">
                <span className="section__icon" aria-hidden="true">
                  {section.icon}
                </span>
                <span>{section.title}</span>
              </div>
              {sectionBadges?.[section.key] && (
                <span className="section__badges">
                  {sectionBadges[section.key]}
                </span>
              )}
              <span className={`section__chevron${isExpanded ? " section__chevron--open" : ""}`}>
                {isExpanded ? <ChevronUp /> : <ChevronDown />}
              </span>
            </button>

            {isExpanded ? (
              <div className="section__content">
                <div className="section__body">
                  {(() => {
                    const wrapClass = sectionInnerWrap?.[section.key];
                    const inner = (
                      <>
                        {extra}
                        {section.actions.length > 0 && (
                          <div className="action-grid">
                            {section.actions.map((action) => (
                              <button
                                key={action.action}
                                type="button"
                                className={`action-tile${
                                  action.disabled ? " action-tile--disabled" : ""
                                }${action.action === "unpauseGame" ? " action-tile--gold" : ""}`}
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
                  })()}
                </div>
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
