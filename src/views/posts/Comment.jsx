import classNames from "classnames";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../contexts.js/appContext";
import { PostsContext } from "../../contexts.js/postsContext";
import Post from "./Post";

const Comment = ({ comment }) => {
  const {
    state: { user },
  } = useContext(AppContext);
  const { deleteComment, editComment } = useContext(PostsContext);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(false);

  const isMyComment = user && user.id === comment.user.id;
  const editInput = useRef();

  useEffect(() => {
    if (editInput.current) {
      editInput.current.value = comment.content;
      editInput.current.focus();
    }
  }, [editInput.current, editing]);

  const deleteMe = () => {
    deleteComment({ comment_id: comment.id });
  };

  const saveComment = () => {
    const newValue = editInput.current.value;
    if (newValue) {
      editComment({
        comment_id: comment.id,
        contents: editInput.current.value,
      });
      setEditing(false);
    } else {
      setError(true);
    }
  };
  const saveOnEnter = ({ key }) => {
    if (key === "Enter") {
      saveComment();
    }
  };

  return (
    <div className="comment  py-1 px-2 hover:bg-sky-900">
      <div className="comment-header flex">
        <div className="font-bold text-cyan-200">
          {comment.user.display_name}
        </div>
        {isMyComment && !editing && (
          <>
            <div className="grow" />
            <button
              onClick={() => setEditing(true)}
              className="ml-2 underline text-white cursor hover:text-yellow-300"
            >
              edit
            </button>
            <button
              className="ml-2 underline text-white cursor hover:text-yellow-300"
              onClick={deleteMe}
            >
              delete
            </button>
          </>
        )}
      </div>
      {!editing && <div> {comment.content}</div>}
      {editing && (
        <>
          <div className="flex">
            <input
              ref={editInput}
              onKeyDown={saveOnEnter}
              onFocus={() => setError(false)}
              className={classNames(
                "rounded border border-black bg-yellow-100 grow focus:bg-white text-black p-2",
                { "border-red-400 bg-red-100": error }
              )}
            />
          </div>

          <div className="flex justify-end space-x-5">
            <button
              className="text-gray-400 hover:text-white"
              onClick={() => {
                setEditing(false);
              }}
            >
              cancel
            </button>
            <button
              className="text-gray-400 hover:text-white"
              onClick={deleteMe}
            >
              delete
            </button>
            <button
              onClick={saveComment}
              className="text-cyan-400 hover:text-yellow-400"
            >
              save
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Comment;
