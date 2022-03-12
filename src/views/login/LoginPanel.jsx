import classNames from "classnames";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext, LoginStates } from "../../contexts.js/appContext";
import NewPostButton from "./NewPostButton";
import UserSummary from "./UserSummary";

const loginModes = {
  LOG_IN: "login",
  SIGN_UP: "sign-up",
  // TODO: SSO
};
//TODO: Refactor and add loading states. Because log-in is like > 1s

const Control = () => {
  const {
    unsetLoginState,
    state: { panelOpen, loginState },
  } = useContext(AppContext);

  const hasError = loginState === LoginStates.ERROR;
  const [loginMode, setLoginMode] = useState(loginModes.LOG_IN);
  const { login, signUp } = useContext(AppContext);
  const emailControl = useRef(null);
  const displayNameControl = useRef(null);
  const passwordControl = useRef(null);

  const doALogin = () => {
    const email = emailControl.current.value;
    const password = passwordControl.current.value;
    if (loginMode === loginModes.SIGN_UP) {
      const displayName = displayNameControl.current.value;
      signUp({ email, password, displayName });
    } else {
      login({ email, password });
    }
  };

  const loginOnEnter = ({ key }) => {
    if (key === "Enter") {
      doALogin();
    }
  };

  const focusFirstOpen = () => {
    const controls = [
      emailControl.current,
      displayNameControl.current,
      passwordControl.current,
    ];
    const firstOpen = controls.find((x) => !!x && !x.value);
    if (firstOpen) {
      firstOpen.focus();
    }
  };

  useEffect(focusFirstOpen, [
    emailControl.current,
    passwordControl.current,
    displayNameControl.current,
  ]);

  const loginWord = loginMode === loginModes.SIGN_UP ? "Sign Up" : "Log In";

  return (
    <div
      data-testid="login-control"
      id="login-holder"
      className={classNames("mx-5 overflow-hidden duration-200", {
        "max-w-0": !panelOpen,
        "max-w-full": panelOpen,
      })}
    >
      <div className="flex flex-col" style={{ minWidth: `13em` }}>
        <img className="w-40 self-center object-cover" src="/brivity.png" />
        <div className="flex flex-col space-y-5">
          <input
            onFocus={unsetLoginState}
            placeholder="email"
            disabled={loginState === LoginStates.PENDING}
            className={classNames("border border-black p-1 disabled", {
              "border-red-400 bg-red-200": hasError,
            })}
            ref={emailControl}
            onKeyDown={loginOnEnter}
          />
          {loginMode === loginModes.SIGN_UP && (
            <input
              onFocus={unsetLoginState}
              data-testid="display-name"
              placeholder="Display Name"
              disabled={loginState === LoginStates.PENDING}
              className={classNames("border border-black p-1", {
                "border-red-400 bg-red-200": hasError,
              })}
              ref={displayNameControl}
              onKeyDown={loginOnEnter}
            />
          )}
          <input
            onFocus={unsetLoginState}
            ref={passwordControl}
            placeholder="Password"
            type="password"
            disabled={loginState === LoginStates.PENDING}
            className={classNames("border border-black p-1", {
              "border-red-400 bg-red-200": hasError,
            })}
            onKeyDown={loginOnEnter}
          />
          <button
            className="self-end font-bold hover:underline "
            onClick={doALogin}
          >
            {loginWord}
          </button>

          {loginMode === loginModes.LOG_IN && (
            <div className="flex flex-col space-y-2">
              <h2 className=" border-t border-black pt-5 text-slate-800 text-right">
                New to bloggity?
              </h2>

              <button
                data-testid="sign-up-button"
                className="self-stretch border border-black rounded bg-cyan-400 font-bold  text-gray-900 "
                onClick={() => setLoginMode(loginModes.SIGN_UP)}
              >
                Create an account
              </button>
            </div>
          )}
        </div>
      </div>
      {/* <button
        onClick={crashApp}
        className="border border-red-400 rounded mt-5 px-5 self-stretch bg-red-200 w-full"
      >
        crash the app
      </button> */}
    </div>
  );
};

export const Expander = () => {
  const {
    state: { panelOpen },
    togglePanel,
  } = useContext(AppContext);
  return (
    <div className="flex justify-end border-b border-black mx-5">
      <button onClick={togglePanel} className="p-5">
        <img
          className={classNames("w-5 self-center object-cover duration-200", {
            "rotate-180": !panelOpen,
          })}
          src="/expander.png"
        />
      </button>
    </div>
  );
};

export const LoginPanel = () => {
  const {
    state: { panelOpen, user },
  } = useContext(AppContext);
  const width = panelOpen ? "18em" : "100px";
  return (
    <div
      id="side-panel-holder"
      className="flex flex-col overflow-hidden border-black border bg-cyan-100 flex-shrink-0"
    >
      <Expander />
      <div
        id="side-panel"
        className=" duration-200  flex flex-col overflow-hidden"
        style={{ width }}
      >
        {!user && <Control />}
        {!!user && (
          <>
            <UserSummary />
            <NewPostButton />
          </>
        )}
      </div>
    </div>
  );
};
