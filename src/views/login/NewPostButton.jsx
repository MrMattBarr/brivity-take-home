import classNames from "classnames";
import { useContext } from "react";
import { AppContext } from "../../contexts.js/appContext";
import { PostsContext } from "../../contexts.js/postsContext";

const NewPostButton = () => {
  const {
    state: { panelOpen },
  } = useContext(AppContext);
  const { startNewPost } = useContext(PostsContext);

  return (
    <button
      id="user-summary"
      onClick={startNewPost}
      className={classNames(
        "m-5 flex items-center border border-black bg-yellow-300 rounded duration-200 p-2 cursor-pointer hover:bg-yellow-200"
      )}
    >
      <img className="w-10 self-center object-cover" src="/newPost.png" />
      {panelOpen && (
        <>
          <h2 className="ml-5 text-xl">New Post</h2>
        </>
      )}
    </button>
  );
};

export default NewPostButton;
