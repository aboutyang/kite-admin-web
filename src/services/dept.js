import { stringify } from 'qs';
import request from '../utils/request';

export async function selectDept() {
  return request(`/api/sys/dept/select`);
}

export async function saveDept(params) {
  return request('/api/sys/dept/save', {
    method: 'POST',
    body: params,
  });
}

export async function updateDept(params) {
  return request('/api/sys/dept/update', {
    method: 'POST',
    body: params,
  });
}

export async function removeDept(payload) {
  return request(`/api/sys/dept/delete?${stringify(payload)}`);
}
