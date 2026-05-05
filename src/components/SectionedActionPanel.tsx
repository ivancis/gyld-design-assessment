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
};

export function SectionedActionPanel({
  sections,
  expandedSections,
  onToggle,
  onActionClick,
}: SectionedActionPanelProps) {
  return (
    <div className="sections-stack">
      {sections.map((section) => {
        if (section.actions.length === 0) return null;

        const isExpanded = expandedSections[section.key];

        return (
          <section key={section.key} className="section-shell">
            <button
              type="button"
              className="section-header"
              onClick={() => onToggle(section.key)}
            >
              <div className="section-header__left">
                <span className="section-icon" aria-hidden="true">
                  {section.icon}
                </span>
                <span>{section.title}</span>
              </div>
              <span className={`section-chevron ${isExpanded ? "is-open" : ""}`}>
                ⌄
              </span>
            </button>

            {isExpanded ? (
              <div className="section-content">
                <div className="action-grid">
                  {section.actions.map((action) => (
                    <button
                      key={action.action}
                      type="button"
                      className={`action-tile ${
                        action.disabled ? "is-disabled" : ""
                      }`}
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
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
