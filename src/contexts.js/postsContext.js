import React, { useContext, useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostsAPI from "../apis/posts.js";
import FocusedPost from "../views/posts/FocusedPost.jsx";
import { AppContext } from "./appContext.js";

const ActionKeys = {
  SET_POSTS: "set_posts",
  SET_META: "set_meta",
  FOCUS_POST: "focus_post",
};

const defaultPostsState = {
  posts: [],
  meta: {},
  focusedPost: undefined,
};

export const PostsContext = React.createContext({});

function PostsReducer(state, action) {
  switch (action.type) {
    case ActionKeys.SET_POSTS: {
      return { ...state, posts: action.value };
    }
    case ActionKeys.SET_META: {
      return { ...state, meta: action.value };
    }
    case ActionKeys.FOCUS_POST: {
      return { ...state, focusedPost: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export const PostsProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, dispatch] = useReducer(PostsReducer, defaultPostsState);
  const { focusedPost } = state;
  const {
    state: { user },
  } = useContext(AppContext);

  const loadPosts = async ({ page }) => {
    // Definitely should be doing this socket-powered
    const { posts, meta } = await PostsAPI.fetch({ page });
    dispatch({ type: ActionKeys.SET_POSTS, value: [...state.posts, ...posts] });
    dispatch({ type: ActionKeys.SET_META, value: meta });
  };

  const focusPost = (post) => {
    dispatch({ type: ActionKeys.FOCUS_POST, value: post });
  };

  useEffect(() => {
    if (!focusedPost) {
      navigate(``);
    } else if (focusedPost.id) {
      navigate(`/posts/${focusedPost.id}`);
    }
  }, [state.focusedPost]);

  const setup = () => {
    loadPosts({ page: 1 });
  };
  useEffect(setup, []);

  useEffect(() => {
    const splitLocations = location.pathname.split("/");
    if (splitLocations.includes("posts")) {
      const expectedPostId =
        splitLocations[splitLocations.indexOf("posts") + 1];
      if (expectedPostId !== `${(focusedPost || {}).id}`) {
        const newFocus = state.posts.find((x) => `${x.id}` === expectedPostId);
        dispatch({ type: ActionKeys.FOCUS_POST, value: newFocus });
      }
    }
  }, [location]);

  const loadMorePosts = async () => {
    loadPosts({ page: state.meta.current_page + 1 });
  };

  const loadMoreComments = async () => {
    const { comments, meta } = await PostsAPI.fetchComments({
      page: focusedPost.comments.meta.current_page + 1,
      postId: focusedPost.id,
    });

    const newPosts = [...state.posts];
    const newFocus = newPosts.find((x) => x.id === focusedPost.id);
    newFocus.comments.comments = [...newFocus.comments.comments, ...comments];
    newFocus.comments.meta = meta;
    dispatch({ type: ActionKeys.SET_POSTS, value: newPosts });
    dispatch({ type: ActionKeys.FOCUS_POST, value: newFocus });
  };

  const commentOnPost = async ({ post_id, content }) => {
    if (!user) {
      console.log("not logged in!");
      return;
    }
    const newComment = await PostsAPI.comment({
      authorization: user.token,
      post_id,
      content,
    });
    const newPosts = [...state.posts];
    const newFocus = newPosts.find((x) => x.id === focusedPost.id);
    newFocus.comments.comments = [
      newComment.comment,
      ...newFocus.comments.comments,
    ];
    dispatch({ type: ActionKeys.SET_POSTS, value: newPosts });
    dispatch({ type: ActionKeys.FOCUS_POST, value: newFocus });
  };

  const publishPost = async ({ post_id, title, body }) => {
    if (!post_id) {
      const response = await PostsAPI.publishPost({
        authorization: user.token,
        title,
        body,
      });
      if (response.error) {
        console.error("oh nooo....");
        return;
      }
      const newPost = response.post;
      newPost.comments = {
        comments: [],
        meta: { comment_count: 0 },
      };
      const newPosts = [newPost, ...state.posts];
      dispatch({ type: ActionKeys.SET_POSTS, value: newPosts });
      dispatch({ type: ActionKeys.FOCUS_POST, value: newPost });
    } else {
      const response = await PostsAPI.patchPost({
        authorization: user.token,
        title,
        body,
        post_id,
      });
      if (response.error) {
        console.error("oh nooo....");
        return;
      }
      const newPost = response.post;
      const newPosts = [...state.posts];
      // Wouldn't be necessary with a paired list / dict approach
      newPosts.find((x) => x.id === newPost.id).body = newPost.body;
      newPosts.find((x) => x.id === newPost.id).title = newPost.title;
      dispatch({ type: ActionKeys.SET_POSTS, value: newPosts });
      dispatch({ type: ActionKeys.FOCUS_POST, value: newPost });
    }
  };

  const deleteFocusedPost = async () => {
    const post_id = state.focusedPost.id;
    const response = await PostsAPI.deletePost({
      authorization: user.token,
      post_id,
    });
    if (response.error) {
      console.error("oh nooo....");
      return;
    }
    const newPosts = state.posts.filter((x) => x.id !== post_id);
    dispatch({ type: ActionKeys.SET_POSTS, value: newPosts });
    dispatch({ type: ActionKeys.FOCUS_POST, value: undefined });
  };

  const editComment = async ({ comment_id, contents }) => {
    const response = await PostsAPI.editComment({
      authorization: user.token,
      comment_id,
      contents,
    });
    if (!response.error) {
      // This would be more efficient with the list / dictionary approach

      // TODO: Find out if this affects the fetch more comments call
      const newFocus = { ...state.focusedPost };
      const thatOneComment = newFocus.comments.comments.find(
        (x) => x.id === comment_id
      );
      thatOneComment.content = response.comment.contents;
      if (response.comment.content !== contents) {
        alert(`Uh oh! Looks like the edit API doesn't work`);
        return;
      }
      dispatch({ type: ActionKeys.FOCUS_POST, value: newFocus });
    } else {
      console.log("oh noooo");
    }
  };

  const deleteComment = async ({ comment_id }) => {
    const response = await PostsAPI.deleteComment({
      authorization: user.token,
      comment_id,
    });
    if (!response.error) {
      // This would be more efficient with the list / dictionary approach

      // TODO: Find out if this affects the fetch more comments call
      const newPosts = [...state.posts];
      const newFocus = newPosts.find((x) => x.id === focusedPost.id);
      newFocus.comments.comments = newFocus.comments.comments.filter(
        (x) => x.id !== comment_id
      );
      newFocus.comments.meta.comment_count =
        newFocus.comments.meta.comment_count - 1;
      dispatch({ type: ActionKeys.SET_POSTS, value: newPosts });
      dispatch({ type: ActionKeys.FOCUS_POST, value: newFocus });
    }
  };

  //TODO: Merge with loadMoreComments
  useEffect(async () => {
    if (focusedPost && focusedPost.comment_count && !focusedPost.comments) {
      const comments = await PostsAPI.fetchComments({
        page: 1,
        postId: focusedPost.id,
      });

      // I mean ... sure we should be doing a paired list(id) and dictionary but this is already a MASSIVE take-home
      const newPosts = [...state.posts];
      const newFocus = newPosts.find((x) => x.id === focusedPost.id);
      newFocus.comments = comments;
      dispatch({ type: ActionKeys.SET_POSTS, value: newPosts });
      dispatch({ type: ActionKeys.FOCUS_POST, value: newFocus });
    }
  }, [focusedPost]);

  const startNewPost = () => {
    dispatch({ type: ActionKeys.FOCUS_POST, value: { editing: true, user } });
  };

  const editFocusedPost = () => {
    dispatch({
      type: ActionKeys.FOCUS_POST,
      value: { ...state.focusedPost, editing: true },
    });
  };

  return (
    <PostsContext.Provider
      value={{
        state,
        editComment,
        focusPost,
        loadPosts,
        loadMoreComments,
        loadMorePosts,
        deleteFocusedPost,
        publishPost,
        commentOnPost,
        startNewPost,
        editFocusedPost,
        deleteComment,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};
