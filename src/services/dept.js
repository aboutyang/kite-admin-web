import request from '../utils/request';

export async function selectDept() {
  return request(`/api/sys/dept/select`);
}
