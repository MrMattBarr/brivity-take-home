import classNames from "classnames";
import { useContext } from "react";
import { AppContext } from "../../contexts.js/appContext";

const UserSummary = () => {
  const {
    state: { user, panelOpen },
  } = useContext(AppContext);
  return (
    <div
      id="user-summary"
      className={classNames(
        "mt-5 mx-5 flex flex-col items-center border border-black bg-white rounded duration-200",
        { "p-5": panelOpen }
      )}
    >
      <img className="w-12 self-center object-cover" src="/pikachu.png" />
      {panelOpen && (
        <>
          <h2 className="font-bold">{user.display_name}</h2>
          <div>({user.email})</div>
        </>
      )}
    </div>
  );
};

export default UserSummary;
