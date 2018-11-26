exports.mock = {
  'list|80-120': [
    {
      id: '@uuid',
      username: '@cname',
      'gender|0-1': 1,
      age: '@integer(1, 150)',
      email: '@email',
      phone: /1[34578]\d{9}/,
      address: '@county(true)',
    },
  ],
};
