import { Utils } from 'torenia';
import { notification, message } from 'antd';

const { request } = Utils;

const { axios } = request;

const methodMeaning = {
  put: '更新',
  patch: '更新',
  post: '创建',
  delete: '删除',
}

axios.interceptors.request.use((config) => {
  const { extra = {} } = config;
  config.url = config.url.replace(/:(\w+)/g, (str, sub1) => {
    return sub1 in extra ? extra[sub1] : sub1;
  });
  config.url = `${config.url}`;
  return config;
});

axios.interceptors.response.use((response) => {
  const { status, data = {}, config } = response;
  const { extra = {} } = config;
  const { msg } = data;
  if (!isSuccess(data)) {
    notification.error({
      message: '请求错误',
      description: msg || extra.msg || `${methodMeaning[method]}失败` || '请求失败',
    });
  } else {

    let { method } = config;

    if (methodMeaning[method]) {
      message.success(msg || extra.msg || `${methodMeaning[method]}成功` || '请求成功');
    }
  }

  if (response.config.needOriginResponse) {
    return response;
  } else {
    return response.data;
  }
}, error => {
  const { response } = error;
  const { status, data = {} } = response;
  const { msg } = data;

  notification.error({
    message: '请求错误',
    description: msg || `未知错误`
  });

});


export default request;

function isSuccess(data) {
  return data && (200 == data || 200 == data.code);
}

export { isSuccess };
