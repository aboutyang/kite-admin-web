import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/sys/user/info');
}

export async function queryMenu() {
  return request('/api/sys/menu/nav');
}
