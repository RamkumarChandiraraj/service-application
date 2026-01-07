import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "accessToken";
const USER_KEY = "authUser";

export const storeTokenAndUser = (token) => {
  localStorage.setItem(TOKEN_KEY, token);

  const decoded = jwtDecode(token);
  localStorage.setItem(USER_KEY, JSON.stringify(decoded));

  return decoded;
};

export const getDecodedUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const clearDecodedUser = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
