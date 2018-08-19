import { querySysUsers, removeSysUser, addSysUser } from '../services/sysUser';

export default {
  namespace: 'sysUser',

  state: {
    page: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(querySysUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *remove({ payload }, { call }) {
      const response = yield call(removeSysUser, payload);
      return response;
    },
    *add({ payload }, { call }) {
      yield call(addSysUser, payload);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        page: action.payload.page,
      };
    },
  },
};
