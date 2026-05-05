import "./App.css";
import { ControlPanelWorkspace } from "./components/ControlPanelWorkspace";
import type { FixtureKey } from "./types";

const DEFAULT_FIXTURE_KEY: FixtureKey = "default";

function App() {
  return (
    <div className="control-panel-page">
      <ControlPanelWorkspace
        key={DEFAULT_FIXTURE_KEY}
        fixtureKey={DEFAULT_FIXTURE_KEY}
      />
    </div>
  );
}

export default App;
