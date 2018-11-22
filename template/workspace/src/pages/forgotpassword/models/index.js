import {
  validateInfo,
  resetPassword,
} from '../services';
import { isSuccess } from 'utils/request';

export default {
  namespace: 'forgotpassword',

  state: {
    current: 0,
  },

  effects: {
    *validateInfo({ payload }, { call, put }) {
      yield put({
        type: 'putPhone',
        payload,
      });
      const res = yield call(validateInfo, payload);
      if(isSuccess(res)) {
        yield put({
          type: 'nextStep'
        });
      }
    },
    *resetPassword({ payload }, { call, put, select }) {
      const forgotpassword = yield select(({ forgotpassword }) => ({ forgotpassword }));
      const res = yield call(resetPassword, { ...payload, phone: forgotpassword.phone });
      if (isSuccess(res)) {
        yield put({
          type: 'nextStep'
        });
      }
    }
  },

  reducers: {
    putPhone(state, { payload }) {
      return { ...state, ...payload }
    },
    nextStep(state) {
      const { current } = state;
      return { ...state, current: current + 1 };
    }
  },

}
