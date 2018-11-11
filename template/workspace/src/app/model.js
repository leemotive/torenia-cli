

export default {
  namespace: 'app',
  state: {
    userInfo: {},
    roles: [],
    permissions: ['overview', 'member', 'team', 'tradingAccount'],
  },
  effects: {

  },
  reducers: {
    putUserInfo(state, { payload }) {

      return { ...state, ...payload };
    }
  }
}
