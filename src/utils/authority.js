// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  return localStorage.getItem('kite-authority');
  // return localStorage.getItem('antd-pro-authority') || 'admin';
}

export function setAuthority(authority) {
  return localStorage.setItem('kite-authority', authority);
}

export function setToken(token) {
  return localStorage.setItem('kite-token', token);
}

export function getToken() {
  return localStorage.getItem('kite-token');
}

export function clearToken() {
  localStorage.removeItem('kite-token');
  localStorage.removeItem('kite-authority');
}
