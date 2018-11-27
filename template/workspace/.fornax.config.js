module.exports = {
  port: 9028,
  apiPrefix: '/api',
  mockRoot: 'mock',
  pageKey: {
    pageSize: 'limit',
    skip: 'skip',
  },
  userContext: {
    mode: 'white',
    list: [
      /session/,
      /forgotpassword/,
      /register/,
      /favicon.ico/,
      /smscode/,
      /password\/forgot/,
      /captcha/,
    ],
  },
};
