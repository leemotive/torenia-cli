import request from 'utils/request';
import config from 'utils/config';

export async function validateInfo(params) {
  return request({
    url: `${config.apiPrefix}/smscode`,
    data: params,
  });
}

export async function resetPassword(params) {
  return request({
    url: `${config.apiPrefix}/password/forgot`,
    method: 'post',
    data: params,
  });
}
