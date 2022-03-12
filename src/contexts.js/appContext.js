import React, { useEffect, useReducer } from "react";
import UsersAPI from "../apis/users";

export const LoginStates = {
  ERROR: "error",
  PENDING: "pending",
  UNSET: "unset",
  SUCCESS: "success",
};

const ActionKeys = {
  SET_USER: "set_user",
  SET_LOGIN_STATE: "set_login_state",
  SET_PANEL_OPEN: "set_panel_open",
};

const defaultAppState = {
  user: null,
  loginState: LoginStates.UNSET,
  panelOpen: true,
};

export const AppContext = React.createContext({});

function AppReducer(state, action) {
  switch (action.type) {
    case ActionKeys.SET_USER: {
      return { ...state, loginState: LoginStates.SUCCESS, user: action.value };
    }
    case ActionKeys.SET_LOGIN_STATE: {
      return { ...state, loginState: action.value };
    }
    case ActionKeys.SET_PANEL_OPEN: {
      return { ...state, panelOpen: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, defaultAppState);

  const login = async ({ email, password }) => {
    dispatch({ type: ActionKeys.SET_LOGIN_STATE, value: LoginStates.PENDING });
    const loginResponse = await UsersAPI.login({ email, password });
    if (loginResponse.error) {
      dispatch({ type: ActionKeys.SET_LOGIN_STATE, value: LoginStates.ERROR });
    } else {
      dispatch({ type: ActionKeys.SET_USER, value: loginResponse });
      dispatch({
        type: ActionKeys.SET_LOGIN_STATE,
        value: LoginStates.SUCCESS,
      });
    }
  };

  const signUp = async ({ email, password, displayName }) => {
    const loginResponse = await UsersAPI.signUp({
      email,
      password,
      displayName,
    });
    if (loginResponse.error) {
      dispatch({ type: ActionKeys.SET_LOGIN_STATE, value: LoginStates.ERROR });
    } else {
      dispatch({ type: ActionKeys.SET_USER, value: loginResponse });
      dispatch({
        type: ActionKeys.SET_LOGIN_STATE,
        value: LoginStates.SUCCESS,
      });
    }
  };

  const crashApp = () => {
    throw "a fit";
  };

  const unsetLoginState = () => {
    dispatch({ type: ActionKeys.SET_LOGIN_STATE, value: LoginStates.UNSET });
  };

  const togglePanel = () => {
    dispatch({ type: ActionKeys.SET_PANEL_OPEN, value: !state.panelOpen });
  };

  //Close panel on login
  useEffect(() => {
    if (!!state.user) {
      dispatch({ type: ActionKeys.SET_PANEL_OPEN, value: false });
    }
  }, [!!state.user]);

  return (
    <AppContext.Provider
      value={{ state, login, signUp, unsetLoginState, togglePanel, crashApp }}
    >
      {children}
    </AppContext.Provider>
  );
};
