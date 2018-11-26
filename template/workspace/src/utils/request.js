import { Utils } from 'torenia';
import { notification, message } from 'antd';

const { request } = Utils;

const { axios } = request;

const methodMeaning = {
  get: '获取',
  put: '更新',
  patch: '更新',
  post: '创建',
  delete: '删除',
};

axios.interceptors.request.use(config => {
  const { extra = {} } = config;
  config.url = config.url.replace(/:(\w+)/g, (str, sub1) => {
    return sub1 in extra ? extra[sub1] : sub1;
  });
  config.url = `${config.url}`;
  return config;
});

axios.interceptors.response.use(
  response => {
    const { data = {}, config } = response;
    const { extra = {}, method } = config;
    const { errMsg, msg: successMsg } = extra;
    const { msg } = data;
    if (!isSuccess(data)) {
      errMsg === false ||
        notification.error({
          message: '请求错误',
          description:
            msg || errMsg || `${methodMeaning[method]}失败` || '请求失败',
        });
    } else {
      successMsg === false ||
        (!successMsg && method === 'get' && !msg) ||
        message.success(
          msg || successMsg || `${methodMeaning[method]}成功` || '请求成功',
        );
    }

    if (response.config.needOriginResponse) {
      return response;
    } else {
      return response.data;
    }
  },
  error => {
    const { response } = error;
    const { status, data = {} } = response;
    const { msg } = data;

    if (401 === status) {
      window.location.href = '/login';
    }

    notification.error({
      message: '请求错误',
      description: msg || `未知错误`,
    });
  },
);

export default request;

function isSuccess(data) {
  return data && (200 == data || 200 == data.code);
}

export { isSuccess };
