import request from 'utils/request';
import config from 'utils/config';

export async function register(params) {
  return request({
    url: `${config.apiPrefix}/register/user`,
    method: 'POST',
    extra: {
      msg: false,
    },
    data: params,
  });
}
