import {
  register
} from '../services';
import { routerRedux } from 'dva/router';
import { isSuccess } from 'utils/request';

export default {
  namespace: 'register',

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const { pathname } = location;
        if ('/register' === pathname) {
          dispatch({
            type: 'init'
          });
        }
      })
    }
  },

  state: {
    success: false,
  },

  effects: {
    *register({ payload }, { put, call }) {
      const res = yield call(register, payload)
      if (isSuccess(res)) {
        yield put({
          type: 'success'
        });

        yield new Promise(resolve => {
          setTimeout(resolve, 3000);
        });
        yield put(routerRedux.push('/login'));
      }
    }
  },

  reducers: {
    success(state) {
      return { ...state, success: true };
    },
    init(state) {
      return { ...state, success: false };
    }
  }

}
