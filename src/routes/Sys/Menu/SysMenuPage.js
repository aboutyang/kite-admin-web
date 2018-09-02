import React, { PureComponent, Fragment } from 'react';

import { connect } from 'dva';
import { Card, Button, Table, Popconfirm, Divider, message } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import EditSysMenu from './EditSysMenu';
import styles from '../TableList.less';

@connect(({ menu, loading }) => ({
  menu,
  treeMenu: menu.treeMenu,
  loading: loading.models.menu,
}))
export default class SysMenuPage extends PureComponent {
  state = {
    modalVisible: false,
    selectedRowKeys: [],
    initObj: {
      type: 1,
    },
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
    this.setState({
      selectedRowKeys: [record.menuId],
    });
  };

  showAddFrom = () => {
    this.setState({
      modalVisible: true,
      isUpdate: false,
      initObj: {
        type: 1,
      },
    });
  };

  showUpdateForm = r => {
    this.setState({
      modalVisible: true,
      isUpdate: true,
      initObj: {
        ...r,
      },
    });
  };

  changeSelectType = e => {
    const { initObj } = this.state;
    this.setState({
      initObj: {
        ...initObj,
        type: e.target.value,
      },
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      isUpdate: false,
      initObj: {},
    });
  };

  handleAdd = (fields, isUpdate) => {
    const { dispatch } = this.props;
    if (isUpdate) {
      dispatch({
        type: 'menu/updateMenu',
        payload: fields,
      })
        .then(response => {
          if (response) {
            if (response.code === 0) {
              message.success(`菜单修改成功`);
            } else {
              message.error(response.msg);
            }
          } else {
            message.error('系统异常，请稍后重试！');
          }
          this.handleModalVisible();
        })
        .then(() => {
          this.handleSearch();
        });
    } else {
      dispatch({
        type: 'menu/saveMenu',
        payload: fields,
      })
        .then(response => {
          if (response) {
            if (response.code === 0) {
              message.success(`新增菜单成功`);
            } else {
              message.error(response.msg);
            }
          } else {
            message.error('系统异常，请稍后重试！');
          }
          this.handleModalVisible();
        })
        .then(() => {
          this.handleSearch();
        });
    }
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/deleteMenu',
      payload: {
        menuId: record.menuId,
      },
    })
      .then(response => {
        if (response) {
          if (response.code === 0) {
            message.success(`删除菜单【${record.name}】成功`);
          } else {
            message.error(response.msg);
          }
        } else {
          message.error('系统异常，请稍后重试！');
        }
      })
      .then(() => {
        this.handleSearch();
      });
  };

  render() {
    const { selectedRowKeys, modalVisible, isUpdate, initObj } = this.state;
    const { treeMenu, loading } = this.props;

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
        title: '图标',
        dataIndex: 'icon',
        render: v => (
          <div>
            <i className={v} />
          </div>
        ),
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
      // onChange: this.handleRowSelect,
      onSelect: this.selectRow,
    };
    return (
      <PageHeaderLayout title="菜单管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.showAddFrom()}>
                新建
              </Button>
              <Button
                icon="reload"
                type="primary"
                onClick={() => this.handleSearch()}
                loading={loading}
              >
                刷新
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
        {modalVisible && (
          <EditSysMenu
            handleAdd={this.handleAdd}
            modalVisible={modalVisible}
            handleModalVisible={this.handleModalVisible}
            changeSelectType={this.changeSelectType}
            isUpdate={isUpdate}
            initObj={initObj}
          />
        )}
      </PageHeaderLayout>
    );
  }
}
