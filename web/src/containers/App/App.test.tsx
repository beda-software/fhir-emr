import { render } from "@testing-library/react";
import { App } from "./";

test("renders welcome text", () => {
  const { getByText } = render(<App />);
  const textElement = getByText(/Welcome World/i);
  expect(textElement).toBeInTheDocument();
});
