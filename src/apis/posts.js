import { URLS } from "./constants";
import axios from "axios";

const defaultHeaders = {
  "Content-Type": "application/json",
};

export const errors = {};

export const PostsAPI = {
  fetch: async ({ page }) => {
    try {
      const response = await axios.get(`${URLS.Posts}?page=${page}`);
      return response.data;
    } catch (exception) {
      return { error: exception };
    }
  },
  fetchComments: async ({ postId, page }) => {
    try {
      const response = await axios.get(
        `${URLS.Posts}/${postId}/comments?page=${page}`
      );
      return response.data;
    } catch (exception) {
      return { error: exception };
    }
  },
  comment: async ({ authorization, post_id, content }) => {
    try {
      const response = await axios.post(
        `${URLS.Comments}`,
        {
          comment: { post_id, content },
        },
        {
          headers: { Authorization: authorization },
        }
      );
      return response.data;
    } catch (exception) {
      return { error: exception };
    }
  },
  publishPost: async ({ authorization, title, body }) => {
    try {
      const response = await axios.post(
        `${URLS.Posts}`,
        {
          post: { title, body },
        },
        {
          headers: { Authorization: authorization },
        }
      );
      return response.data;
    } catch (exception) {
      return { error: exception };
    }
  },
  patchPost: async ({ post_id, authorization, title, body }) => {
    try {
      const response = await axios.patch(
        `${URLS.Posts}/${post_id}`,
        {
          post: { title, body },
        },
        {
          headers: { Authorization: authorization },
        }
      );
      return response.data;
    } catch (exception) {
      return { error: exception };
    }
  },
  deleteComment: async ({ authorization, comment_id }) => {
    try {
      const response = await axios.delete(`${URLS.Comments}/${comment_id}`, {
        headers: { Authorization: authorization },
      });
      return response.data;
    } catch (exception) {
      return { error: exception };
    }
  },
  editComment: async ({ authorization, comment_id, contents }) => {
    try {
      const response = await axios.patch(
        `${URLS.Comments}/${comment_id}`,
        {
          comment: { contents },
        },
        {
          headers: { Authorization: authorization },
        }
      );
      return response.data;
    } catch (exception) {
      return { error: exception };
    }
  },
  deletePost: async ({ authorization, post_id }) => {
    try {
      const response = await axios.delete(`${URLS.Posts}/${post_id}`, {
        headers: { Authorization: authorization },
      });
      return response.data;
    } catch (exception) {
      return { error: exception };
    }
  },
};

export default PostsAPI;
