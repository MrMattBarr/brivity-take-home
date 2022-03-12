import classNames from "classnames";
import { useContext, useEffect, useRef } from "react";
import { PostsContext } from "../../contexts.js/postsContext";

const Post = ({ post }) => {
  const {
    focusPost,
    state: { focusedPost },
  } = useContext(PostsContext);
  const isFocusedPost = focusedPost && focusedPost.id === post.id;
  const bg = isFocusedPost ? "bg-amber-200" : "bg-slate-200 hover:bg-amber-300";
  return (
    <div
      tabIndex={1}
      className={classNames(
        `post border border-black rounded m-5 grow p-5 overflow-hidden duration-200 basis-96 items-center cursor-pointer hover`,
        bg
      )}
      onClick={() => {
        focusPost(post);
      }}
    >
      <div className="post-top flex justify-between">
        <h2 className="text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis text-blue-800">
          {post.title || `untitled post`}
        </h2>
        {post.comment_count > 0 && (
          <div className="comment-count relative ml-5 shrink-0">
            <img className="w-8 self-center object-cover" src="/messages.png" />
            <div className="absolute top-px w-full text-center">
              {post.comment_count}
            </div>
          </div>
        )}
      </div>
      <p className="whitespace-nowrap overflow-hidden text-ellipsis">
        <span className="font-bold">{(post.user || {}).display_name} -</span>{" "}
        {post.body}
      </p>
    </div>
  );
};

export default Post;
