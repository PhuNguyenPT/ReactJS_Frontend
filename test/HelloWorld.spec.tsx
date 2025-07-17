// test/HelloWorld.spec.tsx
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HelloWorld from "../src/components/HelloWorld";

test("renders name", async () => {
  const user = userEvent.setup();
  render(<HelloWorld name="Vitest" />);

  expect(screen.getByText("Hello Vitest x1!")).toBeInTheDocument();

  const button = screen.getByRole("button", { name: "Increment" });
  await user.click(button);

  expect(screen.getByText("Hello Vitest x2!")).toBeInTheDocument();
});
