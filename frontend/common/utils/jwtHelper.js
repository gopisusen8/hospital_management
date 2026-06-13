export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

export const getRole = () => localStorage.getItem('role');
export const setRole = (role) => localStorage.setItem('role', role);
export const removeRole = () => localStorage.removeItem('role');

export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
export const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));
export const removeUser = () => localStorage.removeItem('user');

export const login = (token, role, user) => {
  setToken(token);
  setRole(role);
  setUser(user);
};

export const logout = () => {
  removeToken();
  removeRole();
  removeUser();
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token; // Minimal check, in real app check expiration as well
};
