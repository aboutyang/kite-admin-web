import { stringify } from 'qs';
import request from '../utils/request';

export async function querySysUsers(params) {
  return request(`/api/sys/user/list?${stringify(params)}`);
}

export async function removeSysUser(params) {
  return request('/api/sys/user/delete', {
    method: 'POST',
    body: params,
  });
}

export async function addSysUser(params) {
  return request('/api/sys/user/save', {
    method: 'POST',
    body: params,
  });
}

export async function updateSysUser(params) {
  return request('/api/sys/user/update', {
    method: 'PUT',
    body: params,
  });
}

export async function generator() {
  return request('/api/sys/user/generator', {
    method: 'POST',
  });
}

export async function changeStatus(userIds, status) {
  return request(`/api/sys/user/status/${status}`, {
    method: 'POST',
    body: userIds,
  });
}
