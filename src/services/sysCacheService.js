import { stringify } from 'qs';
import request from '../utils/request';

export async function querySysCacheName() {
  return request(`/api/sys/cache/cacheNames`);
}

export async function querySysCaches(params) {
  return request(`/api/sys/cache/list?${stringify(params)}`);
}

export async function deleteSysCache(payload) {
  return request(`/api/sys/cache/delete/${payload.cacheName}/${payload.cacheKey}`);
}

export async function queryCacheInfo(payload) {
  return request(`/api/sys/cache/${payload.cacheName}/${payload.cacheKey}`);
}
