import { URLS } from "./constants";
import axios from "axios";

const defaultHeaders = {
  "Content-Type": "application/json",
};

export const errors = {};

export const UsersAPI = {
  login: async ({ email, password }) => {
    const options = {
      url: URLS.Login,
      method: "POST",
      headers: defaultHeaders,
      data: { user: { email, password } },
    };

    try {
      const response = await axios(options);
      const user = {
        token: response.headers.authorization,
        email,
        ...response.data,
      };
      return user;
    } catch (exception) {
      return { error: exception };
    }
  },
  signUp: async ({ email, password, displayName }) => {
    const options = {
      url: URLS.Users,
      method: "POST",
      headers: defaultHeaders,
      data: { user: { email, password, display_name: displayName } },
    };

    try {
      const response = await axios(options);
      const user = {
        token: response.headers.authorization,
        email,
        ...response.data,
      };
      return user;
    } catch (exception) {
      return { error: exception };
    }
  },
};

export default UsersAPI;
