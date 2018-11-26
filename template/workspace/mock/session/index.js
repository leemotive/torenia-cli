const users = [
  { username: 'admin', password: 'admin' },
  { username: 'guest', password: 'guest' },
];

exports.handle = router => {
  router.post('/session', ctx => {
    const { username, password } = ctx.request.body;

    const loginsuccess = users.some(user => {
      return user.username === username && user.password === password;
    });

    loginsuccess && (ctx.session.username = username);

    ctx.body = {
      code: loginsuccess ? 200 : 400,
      msg: loginsuccess ? '登录成功' : '登录失败，用户名或密码错误',
      data: {
        username,
      },
    };
    ctx.responseInterceptor = _ => _;
  });

  router.delete('/session', ctx => {
    ctx.session.username = '';

    ctx.body = {};
  });

  router.get('/session', ctx => {
    const { username } = ctx.session;

    if (!username) {
      ctx.status = 401;
    } else {
      ctx.body = {
        username,
      };
    }
  });
};
