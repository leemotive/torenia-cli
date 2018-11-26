import menu from '../.torenia/menu';

export default {
  name: '用户中心',
  menu,
  menuSort: ['overview', 'example'],
  noPerssmisionPages: [
    '/login',
    '/forgotpassword',
    '/register',
    '/notfound',
    '/forbidden',
    '/error',
  ],
  emptyLayoutPages: ['/login', '/forgotpassword', '/register'],
  apiPrefix: '/api',
};
