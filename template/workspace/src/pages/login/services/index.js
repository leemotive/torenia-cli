import request from 'utils/request';
import config from 'utils/config';

export function login(params) {
  return request({
    url: `${config.apiPrefix}/session`,
    method: 'post',
    data: params,
  });
}

export function logout() {
  return request({
    url: `${config.apiPrefix}/session`,
    method: 'delete',
  });
}
