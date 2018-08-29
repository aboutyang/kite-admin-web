import { treeMenu } from '../services/menu';

export default {
  namespace: 'menu',

  state: {
    treeMenu: [],
  },

  effects: {
    *treeMenu(_, { call, put }) {
      const response = yield call(treeMenu);
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
        treeMenu: action.payload.treeMenu,
      };
    },
  },
};
