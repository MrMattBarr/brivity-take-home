export const BRIVITY_API_PREFIX = `https://brivity-react-exercise.herokuapp.com`;

const Users = `${BRIVITY_API_PREFIX}/users`;
const Login = `${Users}/sign_in`;
const Posts = `${BRIVITY_API_PREFIX}/posts`;
const Comments = `${BRIVITY_API_PREFIX}/comments`;
export const URLS = {
  Users,
  Login,
  Posts,
  Comments,
};

export const defaultHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json;charset=UTF-8",
};
