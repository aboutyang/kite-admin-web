import {
  queryRoles,
  removeRole,
  saveRole,
  updateRole,
  roleInfo,
  selectRole,
} from '../services/role';

export default {
  namespace: 'role',

  state: {
    page: [],
    lastQuery: {},
    menuIdList: [],
    roleList: [],
  },

  effects: {
    *fetch({ params }, { call, put }) {
      const response = yield call(queryRoles, params);
      yield put({
        type: 'save',
        response,
        query: params,
      });
    },
    *selectRole(_, { call, put }) {
      const response = yield call(selectRole);
      yield put({
        type: 'select',
        response,
      });
    },
    *roleInfo({ roleId }, { call, put }) {
      const response = yield call(roleInfo, roleId);
      yield put({
        type: 'info',
        response,
      });
    },
    *removeRole({ payload }, { call }) {
      const response = yield call(removeRole, payload);
      return response;
    },
    *saveRole({ payload }, { call }) {
      const response = yield call(saveRole, payload);
      return response;
    },
    *updateRole({ payload }, { call }) {
      const response = yield call(updateRole, payload);
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
        menuIdList: action.response.role.menuIdList,
        deptIdList: action.response.role.deptIdList,
      };
    },
    select(state, action) {
      return {
        ...state,
        roleList: action.response.list,
      };
    },
  },
};
