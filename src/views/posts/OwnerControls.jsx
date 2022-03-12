import classNames from "classnames";
import { useContext } from "react";
import { AppContext } from "../../contexts.js/appContext";
import { PostsContext } from "../../contexts.js/postsContext";

const OwnerControls = () => {
  const {
    state: { user },
  } = useContext(AppContext);
  const {
    state: { focusedPost },
    deleteFocusedPost,
    editFocusedPost,
  } = useContext(PostsContext);

  const shouldShow =
    focusedPost &&
    user &&
    user.id === focusedPost.user.id &&
    focusedPost.id &&
    !focusedPost.editing;
  if (!shouldShow) return <></>;
  return (
    <div
      id="owner-controls"
      className={classNames(
        " border-b border-yellow-400 text-yellow-400   bg-slate-800 p-2"
      )}
    >
      <div className={classNames("flex items-center px-4 space-x-5")}>
        <button
          className="hover:underline cursor-pointer"
          onClick={deleteFocusedPost}
        >
          delete post
        </button>
        <button
          onClick={editFocusedPost}
          className="hover:underline cursor-pointer "
        >
          edit post
        </button>
      </div>
    </div>
  );
};

export default OwnerControls;
