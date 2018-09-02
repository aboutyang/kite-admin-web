import { treeMenu, selectMenu, saveMenu, updateMenu, deleteMenu } from '../services/menu';

export default {
  namespace: 'menu',

  state: {
    treeMenu: [],
    menuList: [],
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
    *selectMenu(_, { call, put }) {
      const response = yield call(selectMenu);
      if (response.code === 0) {
        yield put({
          type: 'select',
          payload: response,
        });
      }
    },
    *saveMenu({ payload }, { call }) {
      const response = yield call(saveMenu, payload);
      return response;
    },
    *updateMenu({ payload }, { call }) {
      const response = yield call(updateMenu, payload);
      return response;
    },
    *deleteMenu({ payload }, { call }) {
      const response = yield call(deleteMenu, payload);
      return response;
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        treeMenu: action.payload.treeMenu,
      };
    },
    select(state, action) {
      return {
        ...state,
        menuList: action.payload.menuList,
      };
    },
  },
};
