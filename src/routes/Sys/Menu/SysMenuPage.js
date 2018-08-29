import React, { PureComponent, Fragment } from 'react';

import { connect } from 'dva';

import { Card, Button, Table, Popconfirm, Divider } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

import styles from '../TableList.less';

@connect(({ menu, loading }) => ({
  menu,
  treeMenu: menu.treeMenu,
  loading: loading.models.menu,
}))
export default class SysMenuPage extends PureComponent {
  state = {
    selectedRowKeys: [],
  };

  componentDidMount() {
    this.handleSearch();
  }

  handleSearch = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/treeMenu',
    });
  };

  selectRow = record => {
    this.setState({ selectedRowKeys: [record.menuId] });
  };

  render() {
    const { selectedRowKeys } = this.state;
    const { treeMenu } = this.props;

    const columns = [
      {
        title: '菜单名称',
        dataIndex: 'name',
      },
      {
        title: '上级菜单',
        dataIndex: 'parentName',
      },
      {
        title: '类型',
        dataIndex: 'type',
      },
      {
        title: '排序号',
        dataIndex: 'orderNum',
      },
      {
        title: '菜单URL',
        dataIndex: 'path',
        width: 150,
      },
      {
        title: '授权标识',
        dataIndex: 'perms',
        width: 200,
      },
      {
        title: '操作',
        render: record => {
          return (
            <Fragment>
              <a onClick={() => this.showUpdateForm(record)}>更新</a>
              <Divider type="vertical" />
              <Popconfirm
                title="确定要删除选中的记录？"
                onConfirm={() => this.handleDelete(record)}
                okText="确定"
                cancelText="取消"
              >
                <a>刪除</a>
              </Popconfirm>
            </Fragment>
          );
        },
      },
    ];

    const rowSelection = {
      type: 'radio',
      selectedRowKeys,
    };
    return (
      <PageHeaderLayout title="菜单管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.showAddFrom()}>
                新建
              </Button>
            </div>
            <Table
              rowKey="menuId"
              columns={columns}
              rowSelection={rowSelection}
              dataSource={treeMenu}
              pagination={false}
              footer={() => ''}
              onRow={record => ({
                onClick: () => {
                  this.selectRow(record);
                },
              })}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
