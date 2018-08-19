import { stringify } from 'qs';
import request from '../utils/request';

export async function querySysUsers(params) {
  return request(`/api/sys/user/list?${stringify(params)}`);
}

export async function removeSysUser(params) {
  return request('/api/sys/user/delete', {
    method: 'DELETE',
    body: params,
  });
}

export async function addSysUser(params) {
  return request('/api/sys/user/save', {
    method: 'POST',
    body: params,
  });
}
