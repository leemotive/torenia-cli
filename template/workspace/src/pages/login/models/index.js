import {
  login,
  logout,
  currentUser,
} from '../services';
import { routerRedux } from 'dva/router';
import { isSuccess } from 'utils/request';

export default {
  namespace: 'session',

  state: {

  },

  effects: {
    *login({payload}, { call, put }) {
      const res = yield call(login, payload);
      if (isSuccess(res)) {
        yield put({
          type: 'app/putUserInfo',
          payload: {
            userInfo: res.data
          }
        })
        yield put(routerRedux.push('/overview'));
      }
    },
    *logout(_, { call, put }) {
      const res = yield call(logout);
      if (isSuccess(res)) {
        yield put(routerRedux.push('/login'));
      }
    }
  },

  reducers: {

  }
}
