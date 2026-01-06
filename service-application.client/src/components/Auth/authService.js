export const login = (authResponse) => {
  localStorage.setItem("token", authResponse.token);
  localStorage.setItem("role", authResponse.role);
  localStorage.setItem("user", JSON.stringify({
    userId: authResponse.userId,
    userName: authResponse.userName
  }));
};

export const logout = () => {
  localStorage.clear();
};

export const getToken = () => localStorage.getItem("token");
export const getRole = () => localStorage.getItem("role");
