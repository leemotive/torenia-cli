const Mock = require('mockjs');

exports.handle = router => {
  router.get('/captcha', ctx => {
    ctx.body = {
      url: Mock.Random.image(),
    };
  });
};
