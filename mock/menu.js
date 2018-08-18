export function loadMenu(req, res) {
  res.send({
    msg: 'success',
    code: 0,
    menuList: [
      {
        name: '工作台',
        path: '/dashboard/workplace',
      },
      {
        name: '监控',
        path: '/dashboard/monitor',
      },
      {
        name: '表单页',
        path: '/form',
        children: [
          {
            name: '基础表单',
            path: '/form/basic-form',
          },
          {
            name: '分步表单',
            path: '/form/step-form',
          },
          {
            name: '高级表单',
            path: '/form/advanced-form',
          },
        ],
      },
      {
        name: '列表页',
        icon: 'table',
        path: '/list',
        children: [
          {
            name: '查询表格',
            path: '/list/table-list',
          },
          {
            name: '标准列表',
            path: '/list/basic-list',
          },
          {
            name: '卡片列表',
            path: '/list/card-list',
          },
          {
            name: '搜索列表',
            path: '/list/search',
            children: [
              {
                name: '搜索列表（文章）',
                path: '/list/search/articles',
              },
              {
                name: '搜索列表（项目）',
                path: '/list/search/projects',
              },
              {
                name: '搜索列表（应用）',
                path: '/list/search/applications',
              },
            ],
          },
        ],
      },
    ],
  });
}
