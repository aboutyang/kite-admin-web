import { stringify } from 'qs';
import request from '../utils/request';

export async function querySyLogs(params) {
  return request(`/api/sys/log/list?${stringify(params)}`);
}
