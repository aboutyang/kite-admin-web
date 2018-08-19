import { selectDept } from '../services/dept';

export default {
  namespace: 'dept',

  state: {
    deptList: [],
  },

  effects: {
    *selectDept(_, { call, put }) {
      const response = yield call(selectDept);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        deptList: action.payload.deptList,
      };
    },
  },
};
