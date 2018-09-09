import { stringify } from 'qs';
import request from '../utils/request';

export async function querySysConfigs(params) {
  return request(`/api/sys/config/list?${stringify(params)}`);
}

export async function saveSysConfig(playload) {
  return request('/api/sys/config/save', {
    method: 'POST',
    body: playload,
  });
}

export async function updateSysConfig(playload) {
  return request('/api/sys/config/update', {
    method: 'POST',
    body: playload,
  });
}

export async function deleteSysConfig(playload) {
  return request('/api/sys/config/delete', {
    method: 'POST',
    body: playload,
  });
}
