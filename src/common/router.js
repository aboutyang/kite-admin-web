import React, { createElement } from 'react';
import { Spin } from 'antd';
import pathToRegexp from 'path-to-regexp';
import Loadable from 'react-loadable';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // register models
  models.forEach(model => {
    if (modelNotExisted(app, model)) {
      // eslint-disable-next-line
      app.model(require(`../models/${model}`).default);
    }
  });

  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return Loadable({
    loader: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
    loading: () => {
      return <Spin size="large" className="global-spin" />;
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/sys/user': {
      component: dynamicWrapper(app, ['sysUser', 'dept'], () =>
        import('../routes/Sys/User/SysUserPage')
      ),
    },
    '/sys/dept': {
      component: dynamicWrapper(app, ['dept'], () => import('../routes/Sys/Dept/SysDeptPage')),
    },
    '/sys/menu': {
      component: dynamicWrapper(app, ['menu'], () => import('../routes/Sys/Menu/SysMenuPage')),
    },
    '/sys/role': {
      component: dynamicWrapper(app, ['role'], () => import('../routes/Sys/Role/SysRolePage')),
    },
    '/sys/log': {
      component: dynamicWrapper(app, ['sysLog'], () => import('../routes/Sys/Log/SysLogPage')),
    },
    '/sys/config': {
      component: dynamicWrapper(app, ['sysConfig'], () =>
        import('../routes/Sys/Config/SysConfigPage')
      ),
    },
    '/sys/cache': {
      component: dynamicWrapper(app, ['sysCache'], () =>
        import('../routes/Sys/Cache/SysCachePage')
      ),
    },
    '/sys/token': {
      component: dynamicWrapper(app, ['sysToken'], () =>
        import('../routes/Sys/Token/SysTokenPage')
      ),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    let router = routerConfig[path];
    if (menuKey) {
      menuItem = menuData[menuKey];
      router = {
        ...router,
        name: router.name || menuItem.name,
        authority: router.authority || menuItem.authority,
        hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
      };
    }
    routerData[path] = router;
  });
  return routerData;
};
