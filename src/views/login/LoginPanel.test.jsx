import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppProvider } from "../../contexts.js/appContext";
import { LoginPanel } from "./LoginPanel";

test("it renders the right starting values", () => {
  render(
    <AppProvider>
      <LoginPanel />
    </AppProvider>
  );
  const loginControl = screen.getByTestId("login-control");
  expect(loginControl).toBeInTheDocument();
  const displayNameControl = screen.queryByTestId("display-name");
  expect(displayNameControl).not.toBeInTheDocument();
  const createButton = screen.queryByTestId("sign-up-button");
  expect(createButton).toBeInTheDocument();
});

test("it renders display name after clicking that button", () => {
  render(
    <AppProvider>
      <LoginPanel />
    </AppProvider>
  );
  const createButton = screen.queryByTestId("sign-up-button");
  userEvent.click(createButton);
  const displayNameControl = screen.queryByTestId("display-name");
  expect(displayNameControl).toBeInTheDocument();
});

// you can imagine where this would go. We'd mock the APIs and provide stores for the deeper tests
