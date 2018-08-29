import { selectDept, saveDept, updateDept, removeDept } from '../services/dept';

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
    *add({ payload }, { call }) {
      const response = yield call(saveDept, payload);
      return response;
    },
    *update({ payload }, { call }) {
      const response = yield call(updateDept, payload);
      return response;
    },
    *remove({ payload }, { call }) {
      const response = yield call(removeDept, payload);
      return response;
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
