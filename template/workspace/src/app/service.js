import request from 'utils/request';
import config from 'utils/config';

export function currentUser() {
  return request({
    url: `${config.apiPrefix}/session`
  });
}

