import { render, screen } from "@testing-library/react";

// Components
import Hero from "./hero";

describe("Hero Component", () => {
  it("renders a heading", () => {
    render(<Hero />);

    const heading = screen.getByRole("heading", {
      name: /RTT/i,
    });

    expect(heading).toBeInTheDocument();
  });

  it("renders the paragraph", () => {
    render(<Hero />);

    const paragraph = screen.getByRole("paragraph");

    expect(paragraph).toBeInTheDocument();
  });
});
