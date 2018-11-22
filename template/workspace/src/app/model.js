import {
  currentUser,
} from './service';
import { isSuccess } from 'utils/request';
import config from 'utils/config';

const { noPerssmisionPages } = config;

export default {
  namespace: 'app',
  state: {
    userInfo: {},
    roles: [],
    permissions: ['overview', 'example', 'example/form', 'example/table'],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location, type) => {
        const { pathname } = location;
        if (!type && !noPerssmisionPages.includes(pathname)) {
          dispatch({
            type: 'currentUserInfo'
          })
        }
      })
    }
  },
  effects: {
    *currentUserInfo(_, { call, put }) {
      const res = yield call(currentUser);
      if (isSuccess) {
        yield put({
          type: 'putUserInfo',
          payload: {
            userInfo: res.data
          }
        })
      }
    },
  },
  reducers: {
    putUserInfo(state, { payload }) {
      return { ...state, ...payload };
    }
  }
}
