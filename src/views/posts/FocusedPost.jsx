import classNames from "classnames";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../contexts.js/appContext";
import { PostsContext } from "../../contexts.js/postsContext";
import Comment from "./Comment";
import OwnerControls from "./OwnerControls";

const FocusedPost = () => {
  const {
    state: { focusedPost },
    focusPost,
    loadMoreComments,
    commentOnPost,
    publishPost,
  } = useContext(PostsContext);
  const {
    state: { user },
  } = useContext(AppContext);

  const [workingTitle, setWorkingTitle] = useState("");
  const updateTitle = () => {
    if (titleInput.current) {
      setWorkingTitle(titleInput.current.value);
    }
  };
  const commentBox = useRef();
  const titleInput = useRef();
  const bodyBox = useRef();

  const style = { maxHeight: focusedPost ? "75%" : "0%" };
  const border = !!focusedPost ? "border" : "";
  const margin = !!focusedPost ? "m-5" : "";
  const post = focusedPost || {};
  const { editing } = post;
  const postComment = () => {
    const comment = commentBox.current.value;
    commentOnPost({ post_id: post.id, content: comment });
    commentBox.current.value = "";
  };

  const readyToPost = !!workingTitle || post.id;

  const publish = () => {
    if (readyToPost) {
      publishPost({
        title: workingTitle || post.title,
        body: bodyBox.current.value,
        post_id: post.id,
      });
    }
  };

  useEffect(() => {
    if (titleInput.current) {
      titleInput.current.focus();
    } else if (!!bodyBox.current) {
      bodyBox.current.value = focusedPost.body || "";
      bodyBox.current.focus();
    } else if (!!commentBox.current) {
      commentBox.current.value = "";
      commentBox.current.focus();
    }
  }, [
    titleInput.current,
    post.id,
    editing,
    commentBox.current,
    bodyBox.current,
  ]);

  const bgClass = editing
    ? "bg-yellow-200 text-black"
    : "bg-blue-900 text-white";

  const postWord = post.id ? "Save" : "Post";

  return (
    <div
      className={classNames(
        `flex flex-col post border-black rounded grow p-5 overflow-hidden duration-200 shrink-0 grow-0 p-0`,
        margin,
        border,
        bgClass
      )}
      style={style}
    >
      <OwnerControls />
      {focusedPost && (
        <>
          <div className="post-top flex flex-row-reverse justify-between mx-5 mt-5 items-start">
            <button
              className="underline whitespace-nowrap"
              onClick={() => {
                focusPost(undefined);
              }}
            >
              X close
            </button>
            {post.id && (
              <h2 className="text-2xl font-bold">
                {post.title || `untitled post`}
              </h2>
            )}
            {!post.id && (
              <input
                ref={titleInput}
                placeholder="Title"
                onChange={updateTitle}
                className="text-2xl p-2 rounded grow mr-10 border bg-yellow-100 border-black focus:bg-white text-black min-w-0"
              />
            )}
          </div>
          <div className="mx-5">- {post.user.display_name}</div>
          {editing && (
            <>
              <textarea
                className="rounded border bg-orange-100 border-black basis-40 no-shrink text-black mx-5 mt-5 p-2 resize-none focus:bg-white"
                placeholder="Optional..."
                ref={bodyBox}
              />
              <button
                onClick={publish}
                className={classNames(
                  "self-end mb-5 mr-5 p-2 text-xl font-bold",
                  {
                    "cursor-not-allowed text-gray-600": !readyToPost,
                    "text-blue-900 hover:underline": readyToPost,
                  }
                )}
              >
                {postWord}
              </button>
            </>
          )}
          {post.id && (
            <>
              {post.body && !editing && (
                <p className="m-5 border border-teal-400 rounded bg-blue-700 shrink-0 overflow-hidden p-2  overflow-auto max-h-56">
                  {post.body}
                </p>
              )}
              <div className="mx-5 comment-control pt-5 flex flex-col">
                {user && !post.editing && (
                  <>
                    <textarea
                      className="rounded border bg-blue-200 text-black p-2 no-resize focus:bg-white"
                      placeholder="Aa..."
                      style={{ resize: "none" }}
                      ref={commentBox}
                    />
                    <button
                      className="self-end p-2 pointer text-yellow-300 font-bold text-xl hover:underline"
                      onClick={postComment}
                    >
                      Comment
                    </button>
                  </>
                )}
                {!user && (
                  <div className="mb-5 bg-gray-200 font-bold text-slate-700 border border-black cursor-default rounded px-5">
                    Sign in (or create an account) to join the conversation!
                  </div>
                )}
              </div>
              {post.comments && (
                <div className=" comments px-5 pb-5 overflow-auto divide-y divide-slate-400">
                  {post.comments.comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} />
                  ))}
                  {post.comments.comments.length <
                    post.comments.meta.total_entries && (
                    <button
                      className=" mt-2 px-5 rounded pointer bg-cyan-400 border border-black text-black font-bold text-lg w-full"
                      onClick={loadMoreComments}
                    >
                      Load More Comments
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FocusedPost;
