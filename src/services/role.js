import { stringify } from 'qs';
import request from '../utils/request';

export async function queryRoles(params) {
  return request(`/api/sys/role/list?${stringify(params)}`);
}

export async function selectRole() {
  return request(`/api/sys/role/select`);
}

export async function roleInfo(roleId) {
  return request(`/api/sys/role/info/${roleId}`);
}

export async function removeRole(params) {
  return request('/api/sys/role/delete', {
    method: 'POST',
    body: params,
  });
}

export async function saveRole(params) {
  return request('/api/sys/role/save', {
    method: 'POST',
    body: params,
  });
}

export async function updateRole(params) {
  return request('/api/sys/role/update', {
    method: 'PUT',
    body: params,
  });
}
