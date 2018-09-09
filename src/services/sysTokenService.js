import { stringify } from 'qs';
import request from '../utils/request';

export async function querySysTokens(params) {
  return request(`/api/sys/token/list?${stringify(params)}`);
}

export async function forceLogout(token) {
  return request(`/api/sys/token/logout?token=${token}`);
}
