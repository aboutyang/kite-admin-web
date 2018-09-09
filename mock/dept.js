export function selectDept(req, res) {
  res.send({
    msg: 'success',
    code: 0,
    deptList: [
      {
        deptId: 1,
        name: '一级部门1',
        parentId: -1,
        list: [
          {
            deptId: 10,
            name: '二级部门11',
            parentId: 1,
          },
          {
            deptId: 12,
            name: '二级部门21',
            parentId: 1,
          },
        ],
      },
      {
        deptId: 2,
        name: '一级部门2',
        parentId: -1,
        list: [
          {
            deptId: 20,
            name: '二级部门21',
            parentId: 2,
          },
          {
            deptId: 21,
            name: '二级部门22',
            parentId: 2,
          },
        ],
      },
    ],
  });
}
