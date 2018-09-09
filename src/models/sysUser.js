import {
  querySysUsers,
  removeSysUser,
  addSysUser,
  updateSysUser,
  generator,
  changeStatus,
  userInfo,
} from '../services/sysUser';

export default {
  namespace: 'sysUser',

  state: {
    page: [],
    lastQuery: {},
    roleIdList: [],
  },

  effects: {
    *fetch({ params }, { call, put }) {
      const response = yield call(querySysUsers, params);
      yield put({
        type: 'save',
        response,
        query: params,
      });
    },
    *userInfo({ userId }, { call, put }) {
      const response = yield call(userInfo, userId);
      yield put({
        type: 'info',
        response,
      });
    },
    *clearRoleIdList(_, { put }) {
      yield put({
        type: 'roleIdList',
      });
    },
    *remove({ payload }, { call }) {
      const response = yield call(removeSysUser, payload);
      return response;
    },
    *add({ payload }, { call }) {
      const response = yield call(addSysUser, payload);
      return response;
    },
    *update({ payload }, { call }) {
      const response = yield call(updateSysUser, payload);
      return response;
    },
    *generator(_, { call }) {
      const response = yield call(generator);
      return response;
    },
    *changeStatus({ userIds, status }, { call }) {
      const response = yield call(changeStatus, userIds, status);
      return response;
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        page: action.response.page,
        lastQuery: action.query,
      };
    },
    info(state, action) {
      return {
        ...state,
        roleIdList: action.response.user.roleIdList,
      };
    },
    roleIdList(state) {
      return {
        ...state,
        roleIdList: [],
      };
    },
  },
};
