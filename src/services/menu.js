import { stringify } from 'qs';
import request from '../utils/request';

export async function treeMenu() {
  return request(`/api/sys/menu/tree`);
}

export async function selectMenu() {
  return request(`/api/sys/menu/select`);
}

export async function saveMenu(params) {
  return request(`/api/sys/menu/save`, {
    method: 'POST',
    body: params,
  });
}

export async function updateMenu(params) {
  return request(`/api/sys/menu/update`, {
    method: 'POST',
    body: params,
  });
}

export async function deleteMenu(params) {
  return request(`/api/sys/menu/delete?${stringify(params)}`);
}
