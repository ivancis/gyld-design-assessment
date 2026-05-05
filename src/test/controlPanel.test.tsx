import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ControlPanelWorkspace } from "../components/ControlPanelWorkspace";

describe("ControlPanelWorkspace", () => {
  it("renders the four control panel sections", () => {
    render(<ControlPanelWorkspace fixtureKey="default" />);

    expect(screen.getByRole("button", { name: /events/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /rewards & punishments/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /membership/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /game management/i }),
    ).toBeInTheDocument();
  });

  it("shows the pause banner for the paused fixture", () => {
    render(<ControlPanelWorkspace fixtureKey="paused" />);

    expect(
      screen.getByText(/events are paused\. your community will still gain points\./i),
    ).toBeInTheDocument();
  });

  it("swaps start event for end and timeout actions after quick start", async () => {
    const user = userEvent.setup();
    render(<ControlPanelWorkspace fixtureKey="default" />);

    await user.click(screen.getByRole("button", { name: /^start event$/i }));
    await user.click(
      screen.getAllByRole("button", { name: /^start event$/i })[1],
    );

    expect(
      screen.queryByRole("button", { name: /^start event$/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /end event/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /timeout event/i }),
    ).toBeInTheDocument();
  });

  it("shows the give-points banner after giving points", async () => {
    const user = userEvent.setup();
    render(<ControlPanelWorkspace fixtureKey="default" />);

    await user.click(screen.getByRole("button", { name: /^give points$/i }));
    await user.click(screen.getAllByRole("button", { name: /^give points$/i })[1]);

    expect(
      screen.getByText(/69 points were given to all members\./i),
    ).toBeInTheDocument();
  });

  it("shows the take-points banner after taking points", async () => {
    const user = userEvent.setup();
    render(<ControlPanelWorkspace fixtureKey="default" />);

    await user.click(screen.getByRole("button", { name: /^take points$/i }));
    await user.click(screen.getAllByRole("button", { name: /^take points$/i })[1]);

    expect(
      screen.getByText(/50 points were taken from all members\./i),
    ).toBeInTheDocument();
  });
});
