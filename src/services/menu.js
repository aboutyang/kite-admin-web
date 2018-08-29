import request from '../utils/request';

export async function treeMenu() {
  return request(`/api/sys/menu/tree`);
}
